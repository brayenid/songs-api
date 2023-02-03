import pkg from 'pg'
import InvariantError from '../../exceptions/InvariantError.js'
import AuthenticationError from '../../exceptions/AuthenticationError.js'
import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
const { Pool } = pkg

class UserService {
  constructor() {
    this._pool = new Pool()
  }

  async addUser(payload) {
    const { username, password, fullname } = payload
    await this.verifyUsername(username)
    const encryptedPassword = await bcrypt.hash(password, 10)
    const id = `user-${nanoid(8)}`

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, encryptedPassword, fullname]
    }

    const { rows, rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError('User gagal ditambahkan')
    }
    return rows[0].id
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username]
    }
    const { rowCount, rows } = await this._pool.query(query)
    if (!rowCount) {
      throw new AuthenticationError('Wrong credential')
    }
    const { id, password: encryptedPassword } = rows[0]
    const isMatch = await bcrypt.compare(password, encryptedPassword)

    if (!isMatch) {
      throw new AuthenticationError('Password not matched')
    }

    return id
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }
    const { rowCount } = await this._pool.query(query)
    if (rowCount > 0) {
      throw new InvariantError('Failed, this username already exist')
    }
  }
}

export default UserService
