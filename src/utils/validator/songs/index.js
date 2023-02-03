import SongPayloadSchema from './schema.js'
import InvariantError from '../../../exceptions/InvariantError.js'

const SongValidator = {
  songPayload: (payload) => {
    const result = SongPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}

export default SongValidator
