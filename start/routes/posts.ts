import Route from '@ioc:Adonis/Core/Route'

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Private
|--------------------------------------------------------------------------
*/

Route.group(() => {
  Route.post('posts', 'PostsController.createPost')
  Route.put('posts/:postUuid', 'PostsController.updatePost')
  Route.delete('posts/:postUuid', 'PostsController.deletePost')
}).middleware('auth:api')

// Public routes
Route.group(() => {
  Route.get('posts', 'PostsController.search')
  Route.get('posts/:uuid', 'PostsController.getPost')
})
