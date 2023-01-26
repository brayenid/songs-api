import autobind from 'auto-bind'

class SongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
    autobind(this)
  }

  async postSongHandler(request, h) {
    this._validator.songPayload(request.payload)
    const { title, year, genre, performer, duration, albumId } = request.payload
    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
    const response = h.response({
      status: 'success',
      data: {
        songId
      }
    })
    response.code(201)
    return response
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query
    if (title && performer) {
      const songs = await this._service.getSongByTitleAndPerformer(title, performer)
      const response = h.response({
        status: 'success',
        data: {
          songs
        }
      })
      response.code(200)
      return response
    } else if (performer) {
      const songs = await this._service.getSongByPerformer(performer)
      const response = h.response({
        status: 'success',
        data: {
          songs
        }
      })
      response.code(200)
      return response
    } else if (title) {
      const songs = await this._service.getSongByTitle(title)
      const response = h.response({
        status: 'success',
        data: {
          songs
        }
      })
      response.code(200)
      return response
    }
    const songs = await this._service.getSongs()
    const response = h.response({
      status: 'success',
      data: {
        songs
      }
    })
    response.code(200)
    return response
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)
    const response = h.response({
      status: 'success',
      data: {
        song
      }
    })
    response.code(200)
    return response
  }

  async putSongHandler(request, h) {
    this._validator.songPayload(request.payload)
    const { id } = request.params
    await this._service.putSong(id, request.payload)
    const response = h.response({
      status: 'success',
      message: 'Song updated'
    })
    response.code(200)
    return response
  }

  async deleteSongHandler(request, h) {
    const { id } = request.params
    await this._service.deleteSong(id)
    const response = h.response({
      status: 'success',
      message: 'Song deleted'
    })
    response.code(200)
    return response
  }
}

export default SongsHandler
