import { Exception } from '@adonisjs/core/build/standalone'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { ImageEntities } from '@ioc:Adonis/Addons/ImageConfig'
import Config from '@ioc:Adonis/Core/Config'
import Logger from '@ioc:Adonis/Core/Logger'
import i18next from '@ioc:I18n/Next'
import Company from 'App/Models/Company'
import User from 'App/Models/User'
import { CompanyProfileValidator } from 'App/Validators/CompanyProfileValidator'
import MediaService from './MediaService'
// import AuthService from './AuthService'

// const authService = new AuthService()

const imageEntities: ImageEntities = Config.get('imageConfig.entities')

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

  public async updateCompanyProfile(
    auth: AuthContract,
    { cover, media, ...data }: CompanyProfileValidator['schema']['props']
  ) {
    const user = auth.user as User

    if (!user.allowedProfiles?.includes(User.ProfileTypes.company)) {
      throw new Exception(i18next.t('company:not company'), 422)
    }

    try {
      const company = await user.related('company').query().firstOrFail()

      company.merge(data)

      if (cover) {
        await MediaService.uploadSingleMedia(
          company.id,
          cover,
          'company',
          imageEntities.company.cover,
          null
        )
      }

      if (media) {
        await MediaService.uploadMultipleMedia(
          company.id,
          media,
          'company',
          imageEntities.company.media,
          null
        )
      }

      await company.save()
      await company.refresh()

      return company
    } catch (err) {
      Logger.error('Error updating company profile: %s', err.message)
      throw new Exception(i18next.t('company:error updating company profile'))
    }
  }
}
