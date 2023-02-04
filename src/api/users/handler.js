import autoBind from 'auto-bind'

class UserHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postUserHandler(request, h) {
    await this._validator.validateUserPayload(request.payload)
    const id = await this._service.addUser(request.payload)
    const response = h.response({
      status: 'success',
      message: 'User created',
      data: {
        userId: id
      }
    })
    response.code(201)
    return response
  }
}

export default UserHandler
