// server.js with ws socket for messaging and cors + cloudinary + multer for image uploading and hosting

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const Conversation = require('./models/Conversation'); // Import the Conversation model
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

require('dotenv').config(); // Add this at the top of your server file

const PORT = process.env.PORT || 3001;
const WDS_SOCKET_PORT = process.env.WDS_SOCKET_PORT || PORT;

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Configure Cloudinary for Image hosting
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => file.filename
  },
});

const parser = multer({ storage: storage });

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());

  // Serve up static assets
  app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

  // Image upload endpoint
  app.post('/upload', parser.single('image'), (req, res) => {
    res.json({ imageUrl: req.file.path });
  });

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Create an HTTP server and integrate it with Apollo Server and WebSocket server
  const httpServer = http.createServer(app);

  // Create a WebSocket server instance
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', async message => {
      try {
        // Convert buffer to string if necessary
        const textMessage = Buffer.isBuffer(message) ? message.toString('utf8') : message;

        console.log('Received message:', textMessage); // Debugging line

        // Check if message is a valid JSON string
        let data;
        try {
          data = JSON.parse(textMessage);
        } catch (jsonError) {
          console.error('Invalid JSON message:', textMessage);
          return; // Skip invalid JSON messages
        }

        // Validate the required fields in the message
        const { senderId, text } = data;
        if (senderId && text) {
          // Save the message to the database
          const newConversation = new Conversation({
            sender: senderId,
            message: text,
            timestamp: new Date().toISOString()
          });
          await newConversation.save();

          // Broadcast the message to all clients
          const broadcastMessage = JSON.stringify(data);
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMessage);
            }
          });
        } else {
          console.error('Invalid message format:', data);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Listen for incoming requests
  db.once('open', () => {
    httpServer.listen(WDS_SOCKET_PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      console.log(`WebSocket server running on ws://localhost:${PORT}`);
    });
  });
};

// Call the async function to start the server
startApolloServer();