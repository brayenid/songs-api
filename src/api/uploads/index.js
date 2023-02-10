import routes from './routes.js'

export default {
  name: 'uploads',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes())
  }
}
