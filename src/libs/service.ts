import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerErrorCode } from "@apollo/server/errors"
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
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        formatError: (formattedError, error) => {
            // go awayyyyy stacktrace!!! go awayyyy
            delete formattedError?.extensions?.stacktrace;
            // Return a different error message
            if (
              formattedError.extensions.code ===
              ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
            ) {
              return {
                ...formattedError,
                message: "Your query doesn't match the schema. Try double-checking it!",
              };
            }
        
            // Otherwise return the formatted error. This error can also
            // be manipulated in other ways, as long as it's returned.
            return formattedError;
          }
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