import dotenv from 'dotenv'
dotenv.config()

const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  token: {
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE
  },
  rabbitmq: {
    host: process.env.RABBITMQ_SERVER
  },
  redis: {
    host: process.env.REDIS_SERVER
  }
}
export default config
