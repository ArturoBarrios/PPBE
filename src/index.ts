import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//highlight-start
import gql from "graphql-tag";
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';
import resolvers from "./resolvers/resolvers.js";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ This now always resolves the actual path correctly
const schemaPath = resolve(__dirname, "schema.graphql");

console.log("📄 Loading schema from:", schemaPath); // debug log

const typeDefs = gql(readFileSync(schemaPath, "utf-8"));



const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start();
//highlight-end

app.use("/graphql", expressMiddleware(server, {
    context: async ({ req, res }) => ({ req, res }) // ✅ Allow access to cookies and res object
  }));



app.listen({ port: PORT, host: '0.0.0.0' });
