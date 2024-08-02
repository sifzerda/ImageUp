import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query getUser($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      email
      imageUrls
    }
  }
`;

export const QUERY_USERS = gql`
  query getUsers{
    users {
      _id
      username
      email
      imageUrls
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      imageUrls
    }
  }
`;