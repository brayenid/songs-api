import AlbumPayloadSchema from './schema.js'
import InvariantError from '../../../exceptions/InvariantError.js'

const AlbumValidator = {
  albumPayload: (payload) => {
    const result = AlbumPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}

export default AlbumValidator
