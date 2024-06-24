export const typeDefs = `#graphql
    scalar JSON
    scalar Date

    type User {
        id: ID
        email: String!
        username: String
        password: String!
    }
    type Conversations {
        id: ID
        initiatorId: String!
        recipientId: String!
    }
    type Message {
        id: ID
        text: String
        timeStamp: Date
        messageStatus: String
    }
    type Query {
        getProfileById (email: String, username: String): User
        getConversations (email: String, username: String): [Conversations]
        getMessage (cid: ID!): [Message]
    }
    type Mutation {
        sendMessage: (body: MessagePayload!)!: Message
        register: (body: UserRegister!)!: User
        login: (body: UserLogin!)!: User
    }
    input UserRegister {
        email: String!
        password: String!
    }
    input UserLogin {
        email: String
        username: String
        password: String!
    }
    input MessagePayload {
        text: String!
        senderId: String!
        timeStamp: Date!
    }
    enum Status {
        read
        unread
    }
`