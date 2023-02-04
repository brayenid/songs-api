import pkg from 'pg'
import { nanoid } from 'nanoid'
import InvariantError from '../../exceptions/InvariantError.js'
import NotFoundError from '../../exceptions/NotFoundError.js'
const { Pool } = pkg

class SongService {
  constructor() {
    this._pool = new Pool()
  }

  async addSong(payload) {
    const { title, year, performer, genre, duration, albumId } = payload
    const id = `song-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId]
    }
    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new InvariantError('Add song failed')
    }
    return rows[0].id
  }

  async getSongs() {
    const { rows } = await this._pool.query('SELECT id, title, performer FROM songs')
    return rows
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }
    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('There is no such song with this ID')
    }
    return rows[0]
  }

  async getSongByTitleAndPerformer(title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)',
      values: [`%${title}%`, `%${performer}%`]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('There is no such song with this query')
    }
    const reducedResults = result.rows.map(({ id, title, performer }) => ({ id, title, performer }))
    return reducedResults
  }

  async getSongByTitle(title) {
    const query = {
      text: 'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1)',
      values: [`%${title}%`]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('There is no such song with this title')
    }
    const reducedResults = result.rows.map(({ id, title, performer }) => ({ id, title, performer }))
    return reducedResults
  }

  async getSongByPerformer(performer) {
    const query = {
      text: 'SELECT * FROM songs WHERE LOWER(performer) LIKE LOWER($1)',
      values: [`%${performer}%`]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('There is no such song with this performer')
    }
    const reducedResults = result.rows.map(({ id, title, performer }) => ({ id, title, performer }))
    return reducedResults
  }

  async putSong(id, payload) {
    const { title, year, performer, genre, duration, albumId } = payload
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Update song failed, the ID is not valid')
    }
  }

  async deleteSong(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Delete song failed, the ID is not valid')
    }
    return result.rows[0].id
  }
}

export default SongService
