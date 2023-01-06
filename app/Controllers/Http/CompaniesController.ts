import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompaniesService from 'App/Services/CompaniesService'
import { CompanyProfileValidator } from 'App/Validators/CompanyProfileValidator'

const companiesService = new CompaniesService()

export default class CompaniesController {
  public async getCompany(ctx: HttpContextContract) {
    return companiesService.getCompany(ctx.auth)
  }

  public async updateCompanyProfile(ctx: HttpContextContract) {
    const data = await ctx.request.validate(CompanyProfileValidator)
    return companiesService.updateCompanyProfile(ctx.auth, data)
  }

  public async searchCompanyPosts(ctx: HttpContextContract) {
    const queryParams = ctx.request.qs()
    return companiesService.searchCompanyPosts(ctx.auth, queryParams)
  }
}
