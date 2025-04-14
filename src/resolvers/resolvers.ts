// src/resolvers/resolvers.ts

import userResolvers from "./userResolvers";
import emailResolvers from "./emailResolvers";

export default {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...emailResolvers.Mutation,
  },
};
