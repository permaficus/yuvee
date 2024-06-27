export interface BrokerExchangeInterface {
    channel: any
    name: string | undefined | null
    type: 'direct' | 'fanout' | 'headers' | 'topic'
    durable: boolean
    autoDelete?: boolean
    internal?: boolean
}

export interface QueueTypeInterface {
    name: string | undefined | null,
    channel: any,
    options?: {
        durable: boolean,
        arguments?: {
            'x-queue-type'?: 'classic' | 'quorum' | 'stream',
            'x-dead-letter-exchange'?: string | string[] | null,
            'x-dead-letter-routing-key'?: string | string[] | null
        }
    }
}
export interface UserDataType {
    email: string
    username: string
    password: string
    avatar?: string
}
export interface UserLoginType {
    email?: string
    username?: string
    password: string
}
export interface ConversationsData {
    id: string,
    initiatorId: string
    recipientId: string
}
export interface MessageArguments {
    [key: string]: string
}
export interface QueryArguments {
    cid?: string
    sort?: 'asc' | 'desc'
    email?: string
    username?: string
}
export interface SendingMessageArguments {
    queue: string
    routingKey: string
    message: string
    from?: string
}
export interface StoringMessageArguments {
    text: string
    senderId: string
    to: string
}