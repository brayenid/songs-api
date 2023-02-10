/*eslint-disable spaced-comment */
import config from './utils/config.js'
import Hapi from '@hapi/hapi'
import ClientError from './exceptions/ClientError.js'
import Jwt from '@hapi/jwt'
import Inert from '@hapi/inert'

//Plugins
import albums from './api/albums/index.js'
import songs from './api/songs/index.js'
import users from './api/users/index.js'
import authentications from './api/authentications/index.js'
import playlists from './api/playlists/index.js'
import collaborations from './api/collaborations/index.js'
import _exports from './api/exports/index.js'
import uploads from './api/uploads/index.js'

// Services
import AlbumService from './services/db/AlbumService.js'
import SongService from './services/db/SongService.js'
import UserService from './services/db/UserService.js'
import AuthenticationService from './services/db/AuthenticationService.js'
import PlaylistService from './services/db/PlaylistService.js'
import CollaborationService from './services/db/CollaborationService.js'
import ProducerService from './services/rabitmq/ProducerService.js'
import StorageService from './services/storage/StorageService.js'
import LikeService from './services/db/LikeService.js'
import CacheService from './services/redis/CacheService.js'

// Validator
import SongValidator from './utils/validator/songs/index.js'
import AlbumValidator from './utils/validator/albums/index.js'
import UserValidator from './utils/validator/users/index.js'
import UserAuthenticationValidator from './utils/validator/authentications/index.js'
import PlaylistValidator from './utils/validator/playlists/index.js'
import CollaborationValidator from './utils/validator/collaborations/index.js'
import ExportValidator from './utils/validator/exports/index.js'
import UploadValidator from './utils/validator/uploads/index.js'

import TokenManager from './utils/token/TokenManager.js'

import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const init = async () => {
  const cacheService = new CacheService()
  const server = Hapi.server({
    port: config.server.port,
    host: config.server.host,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: Jwt
    },
    {
      plugin: Inert
    }
  ])

  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: config.token.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.accessTokenAge
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id
        }
      }
    }
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: new AlbumService(),
        validator: AlbumValidator,
        uploadService: new StorageService(path.resolve(__dirname, 'api/uploads/file/images')),
        uploadValidator: UploadValidator,
        likeService: new LikeService(cacheService)
      }
    },
    {
      plugin: songs,
      options: {
        service: new SongService(),
        validator: SongValidator
      }
    },
    {
      plugin: users,
      options: {
        service: new UserService(),
        validator: UserValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: new AuthenticationService(),
        usersService: new UserService(),
        tokenManager: TokenManager,
        validator: UserAuthenticationValidator
      }
    },
    {
      plugin: playlists,
      options: {
        service: new PlaylistService(),
        validator: PlaylistValidator
      }
    },
    {
      plugin: collaborations,
      options: {
        service: new CollaborationService(),
        playlistService: new PlaylistService(),
        validator: CollaborationValidator
      }
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistService: new PlaylistService(),
        validator: ExportValidator
      }
    },
    {
      plugin: uploads
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
        message: 'server error'
      })
      newResponse.code(500)
      return newResponse
    }
    return h.continue
  })

  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}

init()
