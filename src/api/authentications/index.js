import AuthenticationHandler from './handler.js'
import routes from './routes.js'

export default {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { authenticationsService, usersService, tokenManager, validator }) => {
    const authenticationsHandler = new AuthenticationHandler(authenticationsService, usersService, tokenManager, validator)
    server.route(routes(authenticationsHandler))
  }
}
