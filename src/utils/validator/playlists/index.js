import { PlaylistPayloadSchema, SongToPlaylistSchema } from './schema.js'
import InvariantError from '../../../exceptions/InvariantError.js'

const PlaylistValidator = {
  playlistPayload: (payload) => {
    const result = PlaylistPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  },
  songToPlaylistPayload: (payload) => {
    const result = SongToPlaylistSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}

export default PlaylistValidator
