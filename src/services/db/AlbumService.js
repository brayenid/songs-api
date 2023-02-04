import pkg from 'pg'
import { nanoid } from 'nanoid'
import InvariantError from '../../exceptions/InvariantError.js'
import NotFoundError from '../../exceptions/NotFoundError.js'
const { Pool } = pkg

class AlbumService {
  constructor() {
    this._pool = new Pool()
  }

  async addAlbum(name, year) {
    const id = `album-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new InvariantError('Add album failed')
    }
    return result.rows[0].id
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }
    const querySongs = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    const { rows } = await this._pool.query(querySongs)
    if (!result.rows.length) {
      throw new NotFoundError('There is no such file with this ID')
    }
    const reduceSongDetail = rows.map(({ id, title, performer }) => ({ id, title, performer }))
    const response = {
      ...result.rows[0],
      songs: reduceSongDetail
    }
    return response
  }

  async putAlbum(id, payload) {
    const { name, year } = payload
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Update album failed, the ID is not valid ')
    }
  }

  async deleteAlbum(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Delete album failed, the ID is not valid')
    }
  }
}

export default AlbumService
