import Route from '@ioc:Adonis/Core/Route'

// Public ###############################

// Private ##############################

Route.group(() => {
  Route.get('company', 'CompaniesController.getCompany')
  Route.put('company/profile', 'CompaniesController.updateCompanyProfile')
}).middleware('auth')
