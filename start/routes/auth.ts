import Route from '@ioc:Adonis/Core/Route'

// Public ############

Route.post('login', 'AuthController.login')
Route.post('backoffice/login', 'AuthController.loginAdmin')

// Private ###########

Route.group(() => {
  Route.get('auth', 'AuthController.checkAuthenticated')
  Route.get('logout', 'AutheController.logout')
}).middleware('auth:api,admin_api')
