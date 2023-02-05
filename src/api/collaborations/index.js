import routes from './routes.js'
import ColaborationHandler from './handler.js'

export default {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, playlistService, validator }) => {
    const collaborationHandler = new ColaborationHandler(service, playlistService, validator)
    server.route(routes(collaborationHandler))
  }
}
