export interface BrokerExchangeInterface {
    channel: any
    name: string | undefined | null
    type: 'direct' | 'fanout' | 'headers' | 'topics'
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
}
export interface UserLoginType {
    email?: string
    username?: string
    password: string
}
export interface SendingMessageArguments {
    queue: string
    routingKey: string
    message: string
    from?: string
}