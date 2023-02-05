import { nanoid } from 'nanoid'
import pkg from 'pg'
import InvariantError from '../../exceptions/InvariantError.js'
import AuthorizationError from '../../exceptions/AuthorizationError.js'
import NotFoundError from '../../exceptions/NotFoundError.js'

const { Pool } = pkg

class CollaborationService {
  constructor() {
    this._pool = new Pool()
  }

  async addCollaboration(payload) {
    try {
      const { playlistId, userId } = payload
      const id = `col-${nanoid(16)}`
      const query = {
        text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
        values: [id, playlistId, userId]
      }
      const { rows } = await this._pool.query(query)
      if (!rows[0]) {
        throw new InvariantError('Add collaboration failed')
      }
      return rows[0]
    } catch (error) {
      throw new NotFoundError('Invalid playlist or user')
    }
  }

  async deleteCollaboration(payload) {
    const { playlistId, userId } = payload
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId]
    }
    await this._pool.query(query)
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, userId]
    }

    const { rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new AuthorizationError('Forbidden')
    }
  }
}

export default CollaborationService
