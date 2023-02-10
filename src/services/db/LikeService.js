import pkg from 'pg'
import { nanoid } from 'nanoid'
import InvariantError from '../../exceptions/InvariantError.js'
import NotFoundError from '../../exceptions/NotFoundError.js'
const { Pool } = pkg

class LikeService {
  constructor(cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async likingAction(userId, albumId) {
    const isAlbumLiked = await this.isAlbumLiked(userId, albumId)
    await this._cacheService.delete(`album_likes:${albumId}`)
    if (!isAlbumLiked) {
      await this.addAlbumLike(userId, albumId)
    } else {
      await this.deleteAlbumLike(userId, albumId)
    }
  }

  async addAlbumLike(userId, albumId) {
    try {
      const id = `albumlike-${nanoid(16)}`
      const query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId]
      }
      const { rowCount } = await this._pool.query(query)
      if (!rowCount) {
        throw new InvariantError('Cannot be liked')
      }
    } catch (error) {
      throw new NotFoundError('The ID is not valid, like action cannot be done')
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }
    await this._pool.query(query)
  }

  async isAlbumLiked(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }
    const { rowCount } = await this._pool.query(query)
    if (rowCount > 0) {
      return true
    }
    return false
  }

  async likesCount(albumId) {
    try {
      const result = await this._cacheService.get(`album_likes:${albumId}`)
      const resultJson = {
        count: JSON.parse(result)
      }
      resultJson.isCache = true
      return resultJson
    } catch (err) {
      const query = {
        text: 'SELECT album_id FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      }
      const { rowCount } = await this._pool.query(query)
      await this._cacheService.set(`album_likes:${albumId}`, JSON.stringify(rowCount))

      return rowCount
    }
  }
}

export default LikeService
