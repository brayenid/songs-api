import dotenv from 'dotenv'
import Hapi from '@hapi/hapi'
import ClientError from './exceptions/ClientError.js'
import albums from './api/albums/index.js'
import songs from './api/songs/index.js'
import AlbumService from './services/db/AlbumService.js'
import SongService from './services/db/SongService.js'
import Validator from './utils/validator/index.js'

dotenv.config()

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: new AlbumService(),
        validator: Validator
      }
    },
    {
      plugin: songs,
      options: {
        service: new SongService(),
        validator: Validator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      return newResponse
    }
    return h.continue
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
