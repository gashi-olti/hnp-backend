import Route from '@ioc:Adonis/Core/Route'

// Public ###############################
Route.post('register', 'UsersController.register')
Route.post('verify', 'UsersController.verifyEmail')
Route.post('forgot', 'UsersController.forgotPassword')
Route.post('reset', 'UsersController.resetPassword')

// Private ##############################
