const routes = (handler) => [
  {
    path: '/songs',
    method: 'POST',
    handler: handler.postSongHandler
  },
  {
    path: '/songs',
    method: 'GET',
    handler: handler.getSongsHandler
  },
  {
    path: '/songs/{id}',
    method: 'GET',
    handler: handler.getSongByIdHandler
  },
  {
    path: '/songs/{id}',
    method: 'PUT',
    handler: handler.putSongHandler
  },
  {
    path: '/songs/{id}',
    method: 'DELETE',
    handler: handler.deleteSongHandler
  }
]

export default routes
