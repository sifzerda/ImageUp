const typeDefs = `

  type User {
    _id: ID
    username: String
    email: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Image {
    _id: ID
    filename: String
    path: String
    userId: ID
    uploadedAt: String
  }

  type Query {
    user(userId: ID!): User
    users: [User]
    me: User
    images(userId: ID!): [Image]   
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    removeUser: User
    uploadImage(file: Upload!, userId: ID): Image   
  }

  scalar Upload  
`;

module.exports = typeDefs;