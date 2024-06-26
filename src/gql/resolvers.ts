import GraphQLJSON from "graphql-type-json";
import { GraphQLScalarType, Kind } from "graphql";
import { 
  storingMessages, 
  sendText,
  fetchAllConversations,
  fetchAllMessages,
  registerUser,
  fetchUserProfile
} from "@/worker";

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      if (value instanceof Date) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
      }
      throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
      if (typeof value === 'number') {
        return new Date(value); // Convert incoming integer to Date
      }
      throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        // Convert hard-coded AST string to integer and then to Date
        return new Date(parseInt(ast.value, 10));
      }
      // Invalid hard-coded value (not an integer)
      return null;
    },
  });

const resolvers = {
    JSON: GraphQLJSON,
    Date: dateScalar,
    Query: {
      getProfileById: async (_: undefined, args: any): Promise<object | undefined> => {
        return await fetchUserProfile({...args})
      },
      getConversations: async (_: undefined, args: any): Promise<object | undefined> => {
        return await fetchAllConversations({...args})
      },
      getMessages: async (_: undefined, args: any): Promise<object | undefined> => {
        return await fetchAllMessages({...args})
      }
    },
    Mutation: {
      register: async (_: undefined, args: any): Promise<any> => {
        return await registerUser({...args.body})
      },
      sendMessage: async (_: undefined, args: any): Promise<any> => {
        // sending message
        const { cid, text } = await storingMessages({...args.body});
        await sendText({
          queue: `yuvee@${args.body.to}`,
          routingKey: `*.to.${args.body.to}`,
          message: text,
          from: args.body.from,
          token: cid
        });
        return `Sent`
      }
    }
}

export default resolvers
