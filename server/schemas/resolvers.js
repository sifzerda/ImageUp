const { User, Image } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const { GraphQLUpload } = require('graphql-upload');
const fs = require('fs');
const path = require('path');

const resolvers = {

  Query: {
    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
      throw new AuthenticationError('You must be logged in');
    },

    images: async (parent, { userId }) => {
      return Image.find({ userId });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }
      throw new AuthenticationError('You must be logged in to update your profile');
    },

    removeUser: async (parent, args, context) => {
      if (context.user) {
        try {
          const removedUser = await User.findByIdAndDelete(context.user._id);
          return removedUser;
        } catch (error) {
          throw new Error('Failed to remove user.');
        }
      } else {
        throw new AuthenticationError('You must be logged in to remove a user.');
      }
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = signToken(user);
      return { token, user };
    },

    uploadImage: async (parent, { file, userId }) => {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const filePath = path.join(__dirname, '../../uploads', `${Date.now()}-${filename}`);

      // Save the file to the uploads directory
      await new Promise((resolve, reject) =>
        stream
          .pipe(fs.createWriteStream(filePath))
          .on('finish', resolve)
          .on('error', reject)
      );

      // Save image metadata to the database
      const image = new Image({
        filename,
        path: `/uploads/${path.basename(filePath)}`,
        userId,
      });

      await image.save();

      return image;
    },
  },

  Upload: GraphQLUpload,
};

module.exports = resolvers;