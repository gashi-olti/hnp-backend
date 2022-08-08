import JobsService from 'App/Services/JobsService'

const jobsService = new JobsService()

export default class JobsController {
  public async getJobTypes() {
    return jobsService.getJobTypes()
  }

  public async getJobPositionTypes() {
    return jobsService.getJobPositionTypes()
  }

  public async getLocations() {
    return jobsService.getLocations()
  }
}
