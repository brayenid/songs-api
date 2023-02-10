import routes from './routes.js'
import ExportPlaylistHandler from './handler.js'

export default {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, playlistService, validator }) => {
    const exportPlaylistHandler = new ExportPlaylistHandler(service, playlistService, validator)
    server.route(routes(exportPlaylistHandler))
  }
}
