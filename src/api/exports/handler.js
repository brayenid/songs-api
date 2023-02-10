import autobind from 'auto-bind'

class ExportPlaylistHandler {
  constructor(service, playlistService, validator) {
    this._service = service
    this._playlistService = playlistService
    this._validator = validator

    autobind(this)
  }

  async postExportPlaylist(request, h) {
    const { id: owner } = request.auth.credentials
    const { targetEmail } = request.payload
    const { id: playlistId } = request.params
    await this._playlistService.verifyPlaylistOwner(playlistId, owner)
    await this._validator.exportPayload(request.payload)
    const message = {
      playlistId,
      targetEmail
    }
    await this._service.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Your request is on the queue'
    })
    response.code(201)
    return response
  }
}

export default ExportPlaylistHandler
