const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const { authMiddleware } = require('./utils/auth');
const dotenv = require('dotenv');
dotenv.config();

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve up static assets
  app.use('/images', express.static(path.join(__dirname, '../client/public/images')));
  app.use('/uploads', express.static('uploads')); // Serve uploaded images

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Route to handle image upload
  app.post('/upload', upload.single('file'), async (req, res) => {
    const image = new Image({
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      userId: req.body.userId || null, // Add userId if available
    });

    try {
      await image.save();
      res.json({ filePath: image.path });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save image' });
    }
  });

  // Route to get images for a user
  app.get('/images/:userId', async (req, res) => {
    try {
      const images = await Image.find({ userId: req.params.userId });
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve images' });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();