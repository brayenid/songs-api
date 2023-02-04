import autoBind from 'auto-bind'

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postPlaylistHandler(request, h) {
    await this._validator.playlistPayload(request.payload)
    const { name } = request.payload
    const { id: owner } = request.auth.credentials
    const result = await this._service.addPlaylist(name, owner)
    const response = h.response({
      status: 'success',
      data: {
        playlistId: result
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistsHandler(request, h) {
    const { id } = request.auth.credentials
    const result = await this._service.getPlaylists(id)
    const mappedResult = result.map((result) => {
      return {
        id: result.id,
        name: result.name,
        username: result.owner
      }
    })
    const response = h.response({
      status: 'success',
      data: {
        playlists: mappedResult
      }
    })
    response.code(200)
    return response
  }

  async deletePlaylistHandler(request, h) {
    const { id: owner } = request.auth.credentials
    const { id } = request.params
    await this._service.verifyPlaylistOwner(id, owner)
    await this._service.deletePlaylist(id, owner)
    const response = h.response({
      status: 'success',
      message: 'playlist deleted'
    })
    response.code(200)
    return response
  }

  async postSongToPlaylistHandler(request, h) {
    await this._validator.songToPlaylistPayload(request.payload)
    const { id: playlistId } = request.params
    const { songId } = request.payload
    const { id: owner } = request.auth.credentials
    await this._service.verifyPlaylistOwner(playlistId, owner)

    const result = await this._service.addSongToPlaylist(playlistId, songId)
    await this._service.addPlaylistActivities({ playlistId, songId, username: owner, action: 'add' })

    const response = h.response({
      status: 'success',
      message: 'Song added to playlist',
      data: {
        result
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: owner } = request.auth.credentials
    const { id: playlistId } = request.params
    await this._service.verifyPlaylistOwner(playlistId, owner)
    const result = await this._service.getPlaylistActivities(playlistId)
    const mappedResult = result.map((result) => {
      return {
        username: result.username,
        title: result.title,
        action: result.action,
        time: result.time
      }
    })

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities: mappedResult
      }
    })
    response.code(200)
    return response
  }

  async getSongsFromPlaylistHandler(request, h) {
    const { id: owner } = request.auth.credentials
    const { id: playlistId } = request.params

    await this._service.verifyPlaylistOwner(playlistId, owner)
    const result = await this._service.getSongsInPlaylist(owner)
    const { id, name, username } = await this._service.getPlaylistById(playlistId)
    const response = h.response({
      status: 'success',
      data: {
        playlist: {
          id,
          name,
          username,
          songs: result
        }
      }
    })
    response.code(200)
    return response
  }

  async deleteSongFromPlaylistHandler(request, h) {
    await this._validator.songToPlaylistPayload(request.payload)
    const { songId } = request.payload
    const { id: owner } = request.auth.credentials
    await this._service.verifyPlaylistOwnerBySong(songId, owner)
    const result = await this._service.deleteSongFromPlaylist(songId)
    await this._service.addPlaylistActivities({ playlistId: result, songId, username: owner, action: 'delete' })

    const response = h.response({
      status: 'success',
      message: 'Song successfully deleted from playlist'
    })
    response.code(200)
    return response
  }
}

export default PlaylistHandler
