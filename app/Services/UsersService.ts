import { Exception } from '@adonisjs/core/build/standalone'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'
import i18next from '@ioc:I18n/Next'
import User from 'App/Models/User'
import AuthService from './AuthService'
import RegisterValidator from 'App/Validators/RegisterValidator'
import CompaniesService from './Companies'
import EmailService from './EmailService'
import { getUserName } from 'Utils/utils'

const authService = new AuthService()

export default class UsersService {
  private readonly loginAfterRegister = true

  private companiesService: CompaniesService = new CompaniesService()
  private emailService: EmailService = new EmailService()

  public async register(auth: AuthContract, body: RegisterValidator['schema']['props']) {
    const { profile_type: profileType, ...data } = body

    try {
      if (profileType === User.ProfileTypes.company) {
        const user = await User.create(data)
        const company = await this.companiesService.createCompanyProfile()

        const name = await getUserName(user)

        await user.merge({ companyId: company.id }).save()
        await this.emailService.sendCompany(
          data.email,
          i18next.t('common:registration subject'),
          'register',
          {
            user,
            args: {
              name,
              title: i18next.t('common:registration'),
              url: `${Env.get('FRONTEND_URL')}/verify?token=${user.verificationToken}&email=${
                user.email
              }`,
            },
          }
        )

        return this.loginAfterRegister ? authService.login(auth, user.id) : { success: true }
      }
      return null
    } catch (err) {
      Logger.error('Error registering user: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }
}
