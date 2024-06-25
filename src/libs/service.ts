import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { resolvers, typeDefs } from "@/gql";
import http from 'http';
import cors from 'cors';


const app = express();
const httpServer = http.createServer(app);

const serverInit = async (): Promise<void> => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });
    await server.start();
    app.use(
        '/gql',
        cors<cors.CorsRequest>(),
        express.json(),
        // expressMiddleware accepts the same arguments:
        // an Apollo Server instance and optional configuration options
        expressMiddleware(server),
    );
}

export { httpServer, serverInit }