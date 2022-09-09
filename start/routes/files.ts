import Route from '@ioc:Adonis/Core/Route'

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

Route.get('/image/:filename', 'FileController.image')

/*
|--------------------------------------------------------------------------
| Protected
|--------------------------------------------------------------------------
*/

Route.group(() => {
  Route.post('upload/:entity/type/:type', 'FilesController.uploadImage')
}).middleware(['auth:api'])
