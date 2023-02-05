import pkg from 'pg'
import { nanoid } from 'nanoid'
import InvariantError from '../../exceptions/InvariantError.js'
import NotFoundError from '../../exceptions/NotFoundError.js'
import AuthorizationError from '../../exceptions/AuthorizationError.js'
const { Pool } = pkg

class PlaylistService {
  constructor() {
    this._pool = new Pool()
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new InvariantError('Add playlist failed')
    }
    return result.rows[0].id
  }

  async getPlaylists(id) {
    if (!id) throw new NotFoundError('Your id is not valid')
    const query = {
      text: `
      SELECT DISTINCT playlists.id, playlists.name, playlists.owner, collaborations.user_id, users.username 
      FROM playlists 
      LEFT JOIN collaborations 
      ON playlists.id = collaborations.playlist_id
      LEFT JOIN users
      ON playlists.owner = users.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      `,
      values: [id]
    }
    const { rows } = await this._pool.query(query)
    return rows
  }

  async deletePlaylist(id, owner) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2',
      values: [id, owner]
    }
    await this._pool.query(query)
  }

  async addSongToPlaylist(playlistId, songId) {
    try {
      const id = `ps-${nanoid(16)}`
      const query = {
        text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
        values: [id, playlistId, songId]
      }
      const { rows } = await this._pool.query(query)
      if (!rows[0].id) {
        throw new InvariantError('Add song to playlist failed')
      }
      return rows[0].id
    } catch (error) {
      throw new NotFoundError('Invalid song_id provided')
    }
  }

  async getSongsInPlaylist(owner) {
    const query = {
      text: `SELECT DISTINCT songs.id, songs.title, songs.performer
        FROM songs RIGHT JOIN playlist_songs 
        ON songs.id = playlist_songs.song_id 
        LEFT JOIN playlists 
        ON playlist_songs.playlist_id = playlists.id
        LEFT JOIN collaborations
        ON playlist_songs.playlist_id = collaborations.playlist_id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner]
    }
    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('There is no song in this playlist')
    }
    return rows
  }

  async deleteSongFromPlaylist(songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING playlist_id',
      values: [songId]
    }
    const { rows } = await this._pool.query(query)
    return rows[0].playlist_id
  }

  async addPlaylistActivities({ playlistId, songId, username, action }) {
    const id = `pa-${nanoid(16)}`
    const nowTime = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, username, action, nowTime]
    }
    const { rows } = await this._pool.query(query)
    if (!rows) {
      throw new InvariantError('Fail to add activities')
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time 
      FROM playlist_song_activities 
      JOIN users 
      ON playlist_song_activities.user_id = users.id 
      JOIN songs 
      ON playlist_song_activities.song_id = songs.id 
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId]
    }
    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('No activites')
    }
    return rows
  }

  async verifyPlaylistOwnerCollaborator(playlistId, owner) {
    const query = {
      text: `
      SELECT * FROM playlists 
      LEFT JOIN collaborations 
      ON playlists.id = collaborations.playlist_id
      WHERE playlists.id = $1
      `,
      values: [playlistId]
    }
    const { rowCount, rows } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('No song in this playlist')
    }
    if (rows[0].owner !== owner) {
      if (rows[0].user_id !== owner) {
        throw new AuthorizationError('You have no access to this playlist')
      }
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: `
      SELECT * FROM playlists 
      WHERE playlists.id = $1
      `,
      values: [playlistId]
    }
    const { rowCount, rows } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('No song in this playlist')
    }
    if (rows[0].owner !== owner) {
      throw new AuthorizationError('You have no access to this playlist')
    }
  }

  async verifyPlaylistOwnerBySong(songId, owner) {
    const query = {
      text: `SELECT playlist_songs.playlist_id, playlists.owner, collaborations.user_id 
      FROM playlist_songs 
      JOIN playlists 
      ON playlist_songs.playlist_id = playlists.id 
      LEFT JOIN collaborations 
      ON playlist_songs.playlist_id = collaborations.playlist_id WHERE playlist_songs.song_id = $1 
      AND (playlists.owner = $2 OR collaborations.user_id = $2)`,
      values: [songId, owner]
    }
    const { rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new AuthorizationError('You do not have any access')
    }
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists 
      JOIN users 
      ON playlists.owner = users.id WHERE playlists.id = $1`,
      values: [id]
    }
    const { rows } = await this._pool.query(query)
    return rows[0]
  }
}

export default PlaylistService
