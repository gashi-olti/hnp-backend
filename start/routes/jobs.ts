import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('job/jobtypes', 'JobsController.getJobTypes')
  Route.get('job/jobpositiontypes', 'JobsController.getJobPositionTypes')
  Route.get('job/cities', 'JobsController.getCities')
})
