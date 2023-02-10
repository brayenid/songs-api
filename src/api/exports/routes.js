const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: handler.postExportPlaylist,
    options: {
      auth: 'songsapp_jwt'
    }
  }
]

export default routes
