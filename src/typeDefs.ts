import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: String
    name: String
    email: String
  }

  type Query {
    users: [User]
    user(id: String!): User
  }

  type Mutation {
    createUser(email: String!): User
    updateUser(id: String!, name: String, email: String): User
    deleteUser(id: String!): Boolean
  }
`;
