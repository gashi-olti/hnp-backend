import Route from '@ioc:Adonis/Core/Route'

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

Route.get('/image/:filename', 'FilesController.image')

/*
|--------------------------------------------------------------------------
| Protected
|--------------------------------------------------------------------------
*/

Route.group(() => {
  Route.post('upload/:entity/type/:type', 'FilesController.uploadImage')
}).middleware(['auth:api'])
