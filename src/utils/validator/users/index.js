import InvariantError from '../../../exceptions/InvariantError.js'
import UserPayloadSchema from './schema.js'

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default UserValidator
