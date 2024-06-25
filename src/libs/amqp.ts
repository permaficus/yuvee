import * as MessageBroker from 'amqplib';
import { DEFAULT_EXCHANGE, MESSAGE_BROKER_SERVICE } from '@/constant/config';
import EventEmitter from 'events';
import { BrokerExchangeInterface, QueueTypeInterface } from '@/type/types';

class RabbitInstance extends EventEmitter {
    connection: any
    attempt: number
    maxAttempt: number
    userClosedConnection: boolean
    defaultExchange: string

    constructor() {
        super()
        this.connection = null
        this.attempt = 0
        this.maxAttempt = 20
        this.userClosedConnection = false
        this.defaultExchange = DEFAULT_EXCHANGE
        this.onError = this.onError.bind(this)
        this.onClosed = this.onClosed.bind(this)
    }
    setClosingState = (value: boolean): void => {
        this.userClosedConnection = value
    }
    connect = async () => {
        try {
            const conn = await MessageBroker.connect(MESSAGE_BROKER_SERVICE);
            const channel = await conn.createChannel();
            const EventListener = { conn, channel };
            conn.on('error', this.onError);
            conn.on('close', this.onClosed);
            this.emit('connected', EventListener);
            this.connection = conn
            this.attempt = 0
        } catch (error: any) {
            if (error.code === 'ECONNREFUSED') {
                this.emit('ECONNREFUSED', error.message);
                if (this.attempt >= this.maxAttempt) {
                    return
                }
            }
            if ((/ACCESS_REFUSED/gi).test(error.message)) {
                this.emit('ACCREFUSED', error.message);
                return;
            }
            this.onError(error)
        }
    }
    initiateExchange = async ({...args}: BrokerExchangeInterface): Promise<string> => {
        await args.channel.assertExchange(
            args.name || this.defaultExchange,
            args.type,
            {
                durable: args.durable,
                autoDelete: args.autoDelete,
                internal: args.internal
            }
        );
        return args.name || this.defaultExchange
    }
    createQueue = async ({...args}: QueueTypeInterface): Promise<any> => {
        await args.channel.assertQueue(args.name, { ...args.options });
    }
    reconnect = (): void => {
        this.attempt++
        this.emit('reconnect', this.attempt);
        setTimeout((async () => await this.connect()), 5000)
    }
    onError = (error: any): void => {
        this.connection = null;
        this.emit('error', error)
        if (error.message !== 'Connection closing') {
            this.reconnect();
        }
    }
    onClosed = (): void => {
        this.connection = null;
        this.emit('close', this.connection);
        if (!this.userClosedConnection) {
            this.reconnect();
        }
    }
}

export { RabbitInstance, DEFAULT_EXCHANGE, MESSAGE_BROKER_SERVICE }