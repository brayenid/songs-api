const routes = (handler) => [
  {
    path: '/albums',
    method: 'POST',
    handler: handler.postAlbumHandler
  },
  {
    path: '/albums/{id}',
    method: 'GET',
    handler: handler.getAlbumByIdHandler
  },
  {
    path: '/albums/{id}',
    method: 'PUT',
    handler: handler.putAlbumHandler
  },
  {
    path: '/albums/{id}',
    method: 'DELETE',
    handler: handler.deleteAlbumHandler
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000
      }
    }
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postLikeAlbumHandler,
    options: {
      auth: 'songsapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getLikeAlbumHandler
  }
]

export default routes
