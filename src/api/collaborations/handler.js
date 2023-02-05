import autobind from 'auto-bind'

class ColaborationHandler {
  constructor(service, playlistService, validator) {
    this._service = service
    this._playlistService = playlistService
    this._validator = validator

    autobind(this)
  }

  async postCollaborationHandler(request, h) {
    const { id: owner } = request.auth.credentials
    const { playlistId } = request.payload
    await this._validator.collaborationPayload(request.payload)
    const result = await this._service.addCollaboration(request.payload)
    await this._service.verifyPlaylistOwner(playlistId, owner)
    const response = h.response({
      status: 'success',
      data: {
        collaborationId: result.id
      }
    })
    response.code(201)
    return response
  }

  async deleteCollaborationHandler(request, h) {
    const { playlistId } = request.payload
    const { id: owner } = request.auth.credentials
    await this._validator.collaborationPayload(request.payload)
    await this._playlistService.verifyPlaylistOwner(playlistId, owner)
    await this._service.deleteCollaboration(request.payload)

    const response = h.response({
      status: 'success',
      message: 'collaboration successfully deleted'
    })
    response.code(200)
    return response
  }
}

export default ColaborationHandler
