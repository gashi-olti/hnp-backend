import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompaniesService from 'App/Services/Companies'

const companiesService = new CompaniesService()

export default class CompaniesController {
  public async getCompany(ctx: HttpContextContract) {
    return companiesService.getCompany(ctx.auth)
  }
}
