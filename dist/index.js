// src/index.ts
import express from "express";
import cors from "cors";
import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";

// src/db/prismaClient.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var prismaClient_default = prisma;

// src/resolvers/userResolvers.ts
var userResolvers = {
  User: {
    id: (parent) => parent.id
    // Prisma always returns `id`, no `_id`
  },
  Query: {
    async user(_, { id }) {
      return await prismaClient_default.user.findUnique({
        where: { id }
      });
    },
    async users() {
      return await prismaClient_default.user.findMany();
    }
  },
  Mutation: {
    async createUser(_, { email }) {
      try {
        const newUser = await prismaClient_default.user.create({
          data: { email }
        });
        return newUser;
      } catch (error) {
        console.error("[createUser] Error:", error);
        return null;
      }
    },
    async updateUser(_, args) {
      try {
        const updatedUser = await prismaClient_default.user.update({
          where: { id: args.id },
          data: {
            name: args.name ?? void 0,
            email: args.email ?? void 0
          }
        });
        return updatedUser;
      } catch (error) {
        console.error("[updateUser] Error:", error);
        return null;
      }
    },
    async deleteUser(_, { id }) {
      try {
        await prismaClient_default.user.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error("[deleteUser] Error:", error);
        return false;
      }
    }
  }
};
var userResolvers_default = userResolvers;

// src/resolvers/emailResolvers.ts
import { Resend } from "resend";
var emailResolvers = {
  Mutation: {
    sendTestEmail: async (_, { to }) => {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: "PeacePad <onboarding@resend.dev>",
        to: [to],
        subject: "Welcome to PeacePad",
        html: `<p>Congrats on finding your quiet place \u{1F9D8}\u200D\u2642\uFE0F</p>`
      });
      if (error) {
        console.error("[Email Error]", error);
        return false;
      }
      console.log("[Email Sent]", data);
      return true;
    }
  }
};
var emailResolvers_default = emailResolvers;

// src/resolvers/resolvers.ts
var resolvers_default = {
  Query: {
    ...userResolvers_default.Query
  },
  Mutation: {
    ...userResolvers_default.Mutation,
    ...emailResolvers_default.Mutation
  }
};

// src/index.ts
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
var __filename2 = fileURLToPath(import.meta.url);
var __dirname2 = dirname(__filename2);
var PORT = process.env.PORT || 4e3;
var app = express();
app.use(cors());
app.use(express.json());
var schemaPath = resolve(__dirname2, "schema.graphql");
console.log("\u{1F4C4} Loading schema from:", schemaPath);
var typeDefs = gql(readFileSync(schemaPath, "utf-8"));
var server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers: resolvers_default })
});
await server.start();
app.use("/graphql", expressMiddleware(server));
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
//# sourceMappingURL=index.js.map