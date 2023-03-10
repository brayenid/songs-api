import pkg from 'pg'
import InvariantError from '../../exceptions/InvariantError.js'
const { Pool } = pkg

class AuthenticationService {
  constructor() {
    this._pool = new Pool()
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token]
    }

    await this._pool.query(query)
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    }

    const { rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new InvariantError('Refresh token invalid')
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    }

    await this._pool.query(query)
  }
}

export default AuthenticationService
