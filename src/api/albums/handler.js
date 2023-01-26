import autoBind from 'auto-bind'

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

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
}

export default AlbumsHandler
