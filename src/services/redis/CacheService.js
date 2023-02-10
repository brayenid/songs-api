import redis from 'redis'
import config from '../../utils/config.js'

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host
      }
    })
    this._client.on('error', (error) => {
      console.log(error)
    })
    this._client.connect()
  }

  async set(key, value, expirationSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationSecond
    })
  }

  async get(key) {
    const result = await this._client.get(key)
    if (result === null) throw new Error('Cache tidak ditemukan')
    return result
  }

  delete(key) {
    return this._client.del(key)
  }
}

export default CacheService
