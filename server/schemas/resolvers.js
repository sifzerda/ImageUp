const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

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
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },


  updateUser: async (parent, { username, email, password, imageUrls }, context) => {
    if (context.user) {
      // Create an update object
      const updateFields = {};
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
      if (password) updateFields.password = password;

      // Append each new image URL to the existing array
      if (imageUrls && imageUrls.length > 0) {
        await User.updateOne(
          { _id: context.user._id },
          { $push: { imageUrls: { $each: imageUrls } } }
        );
      }

      // Update other fields
      return await User.findByIdAndUpdate(context.user._id, { $set: updateFields }, { new: true });
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

  },
}
 

module.exports = resolvers;