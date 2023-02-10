import autoBind from 'auto-bind'
import config from '../../utils/config.js'

class AlbumsHandler {
  constructor(service, validator, uploadService, uploadValidator, likeService) {
    this._service = service
    this._validator = validator
    this._uploadService = uploadService
    this._uploadValidator = uploadValidator
    this._likeService = likeService

    autoBind(this)
  }

  async postAlbumHandler(request, h) {
    this._validator.albumPayload(request.payload)
    const { name, year } = request.payload
    const albumId = await this._service.addAlbum(name, year)
    const response = h.response({
      status: 'success',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)
    const response = h.response({
      status: 'success',
      data: {
        album
      }
    })
    response.code(200)
    return response
  }

  async putAlbumHandler(request, h) {
    this._validator.albumPayload(request.payload)
    const { id } = request.params
    await this._service.putAlbum(id, request.payload)
    const response = h.response({
      status: 'success',
      message: 'Album edited'
    })
    response.code(200)
    return response
  }

  async deleteAlbumHandler(request, h) {
    const { id } = request.params
    await this._service.deleteAlbum(id)
    const response = h.response({
      status: 'success',
      message: 'Album deleted'
    })
    response.code(200)
    return response
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload
    this._uploadValidator.validateImageHeaders(cover.hapi.headers)
    const { id } = request.params
    const filename = await this._uploadService.writeFile(cover, cover.hapi)
    const imageUrl = `http://${config.server.host}:${config.server.port}/upload/images/${filename}`
    await this._service.updateAlbumCover(imageUrl, id)

    const response = h.response({
      status: 'success',
      message: 'Album cover updated',
      data: {
        fileLocation: imageUrl
      }
    })
    response.code(201)
    return response
  }

  async postLikeAlbumHandler(request, h) {
    const { id: userId } = request.auth.credentials
    const { id: albumId } = request.params
    await this._likeService.likingAction(userId, albumId)

    const response = h.response({
      status: 'success',
      message: 'action success'
    })
    response.code(201)
    return response
  }

  async getLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params
    const result = await this._likeService.likesCount(albumId)

    const response = h.response({
      status: 'success',
      data: {
        likes: result.count ? result.count : result
      }
    })
    response.code(200)
    if (result.isCache) {
      response.header('X-Data-Source', 'cache')
    }
    return response
  }
}

export default AlbumsHandler
