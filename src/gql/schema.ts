const typeDefs = `#graphql
    scalar JSON
    scalar Date
    
    type User {
        userId: String!
        email: String!
        username: String!
    }
    type Conversations {
        id: String
        initiatorId: String
        recipientId: String
    }
    type Message {
        id: String
        text: String
        timestamp: Date
        messageStatus: String
    }
    type Query {
        getProfileById(username: String): User
        getConversations(username: String): [Conversations]
        getMessages(cid: String!): [Message]
    }
    type Mutation {
        sendMessage (body: MessagePayload): String
        register (body: UserRegister): User
        login (body: UserLogin): User
    }
    input UserRegister {
        email: String!
        username: String
        password: String!
    }
    input UserLogin {
        email: String
        username: String
        password: String!
    }
    input MessagePayload {
        text: String!
        from: String!
        to: String!
    }
`

export default typeDefs