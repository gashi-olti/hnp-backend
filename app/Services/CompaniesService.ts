import { Exception } from '@adonisjs/core/build/standalone'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Logger from '@ioc:Adonis/Core/Logger'
import i18next from '@ioc:I18n/Next'
import Company from 'App/Models/Company'
import User from 'App/Models/User'
// import AuthService from './AuthService'

// const authService = new AuthService()

export default class CompaniesService {
  public async getCompany(auth: AuthContract) {
    const user = auth.user as User
    const company = await user.related('company').query().firstOrFail()
    try {
      return {
        ...company.serialize(),
        email: user.email,
      }
    } catch (err) {
      Logger.error('Error getting company: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async createCompanyProfile() {
    const company = Company.create({})
    return company
  }
}
