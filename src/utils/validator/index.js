import { AlbumPayloadSchema, SongPayloadSchema } from './schema.js'
import InvariantError from '../../exceptions/InvariantError.js'

const Validator = {
  albumPayload: (payload) => {
    const result = AlbumPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  },
  songPayload: (payload) => {
    const result = SongPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}

export default Validator
