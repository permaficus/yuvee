import dotenv from 'dotenv'
dotenv.config().parsed

export const DEFAULT_EXCHANGE = process.env.DEFAULT_EXCHANGE
export const MESSAGE_BROKER_SERVICE = process.env.MESSAGE_BROKER_SERVICE
export const NODE_ENV = process.env.NODE_ENV
export const LOCAL_SERVICE_PORT = process.env.LOCAL_SERVICE_PORT
export const GEN_SALT = process.env.GEN_SALT
export const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY