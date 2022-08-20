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
import VerifyEmailValidator from 'App/Validators/VerifyEmailValidator'
import { DateTime } from 'luxon'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPassword'

const authService = new AuthService()

export default class UsersService {
  private readonly loginAfterRegister = true
  private readonly loginAfterVerify = true

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

  // public async sendVerifyEmail(auth: AuthContract) {
  //   const user = auth.user as User

  //   try {
  //     if (!user) {
  //       throw new Error('Error occured.')
  //     }

  //     if (user.verificationToken === null) {
  //       user.setVerificationToken()
  //     }

  //     await user.save()

  //   }
  // }

  public async verifyEmail(auth: AuthContract, data: VerifyEmailValidator['schema']['props']) {
    try {
      const { email, token } = data

      const user = await User.query()
        .where('email', email)
        .where('verification_token', token)
        .whereNull('verified_at')
        .firstOrFail()

      console.log('user ', user)
      user.verificationToken = null
      user.verificationCreatedAt = null
      user.verifiedAt = DateTime.utc()

      await user.save()

      return this.loginAfterVerify ? authService.login(auth, user.id) : { success: true }
    } catch (err) {
      Logger.error('Error verifying user: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async forgotPassword(data: ForgotPasswordValidator['schema']['props']) {
    try {
      const { email } = data

      const user = await User.query().where('email', email).firstOrFail()

      user.setVerificationToken()

      await user.save()

      await this.emailService.sendUser(
        data.email,
        i18next.t('common:forgot password subject'),
        'forgot',
        {
          args: {
            userName: '',
            title: i18next.t('common:forgot password'),
            url: `${Env.get('FRONTEND_URL')}/reset?token=${user.verificationToken}&email=${
              user.email
            }`,
          },
        }
      )

      return { success: true }
    } catch (err) {
      Logger.error('Error forgotPassword: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async resetPassword(data: ResetPasswordValidator['schema']['props']) {
    try {
      const { password, token } = data

      const user = await User.query().where('verification_token', token).firstOrFail()

      if (user.isInvalidToken()) {
        throw new Exception(i18next.t('validation:invalid token'))
      }

      user.password = password
      user.verificationToken = null
      user.verificationCreatedAt = null
      if (user.verifiedAt === null) {
        user.verifiedAt = DateTime.utc()
      }

      await user.save()
      // Clear all existing api_tokens for the user on successful password reset.
      await user.revokeUserTokens()

      await this.emailService.sendUser(
        user.email,
        i18next.t('common:password reset subject'),
        'password-reset-success',
        {
          args: {
            userName: '',
            title: i18next.t('common:password reset'),
            url: `${Env.get('FRONTEND_URL')}/login`,
          },
        }
      )

      return { success: true }
    } catch (err) {
      Logger.error('Error resetPassword: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }
}
