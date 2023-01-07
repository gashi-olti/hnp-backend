import Route from '@ioc:Adonis/Core/Route'

// Public ###############################

// Private ##############################

Route.group(() => {
  Route.get('company', 'CompaniesController.getCompany')
  Route.put('company/profile', 'CompaniesController.updateCompanyProfile')
  Route.get('company/posts', 'CompaniesController.searchCompanyPosts')
  Route.get('company/posts/:postUuid', 'PostsController.getPostForCompany')
  Route.get('company/details/:companyUuid', 'CompaniesController.getCompanyDetails')
}).middleware('auth')
