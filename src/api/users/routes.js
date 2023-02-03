const routes = (handler) => [
  {
    path: '/users',
    method: 'POST',
    handler: handler.postUserHandler
  }
]

export default routes
