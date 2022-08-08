import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('job/types', 'JobsController.getJobTypes')
  Route.get('job/positiontypes', 'JobsController.getJobPositionTypes')
  Route.get('job/locations', 'JobsController.getLocations')
})
