import dotenv from 'dotenv'
dotenv.config().parsed

export const DEFAULT_EXCHANGE = process.env.DEFAULT_EXCHANGE
export const MESSAGE_BROKER_SERVICE = process.env.MESSAGE_BROKER_SERVICE