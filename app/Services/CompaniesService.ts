import { Exception } from '@adonisjs/core/build/standalone'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { ImageEntities } from '@ioc:Adonis/Addons/ImageConfig'
import Config from '@ioc:Adonis/Core/Config'
import Logger from '@ioc:Adonis/Core/Logger'
import i18next from '@ioc:I18n/Next'
import Company from 'App/Models/Company'
import Media from 'App/Models/Media'
import Post from 'App/Models/Post'
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

    const cover = await Media.query()
      .select('*')
      .where('company_id', '=', company.id)
      .andWhere('media_type', '=', 'cover')
      .andWhereNotNull('source')
      .limit(1)
      .first()

    const media = await Media.query()
      .select('*')
      .where('company_id', '=', company.id)
      .where('media_type', '=', 'media')
      .andWhereNotNull('source')
      .limit(4)

    try {
      return {
        ...company.serialize(),
        email: user.email,
        cover: {
          uuid: cover?.uuid,
          title: cover?.title,
          source: cover?.source,
          type: cover?.mimeType,
          src: cover?.src,
        },
        media,
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

      // const coverExists = await Media.query()
      //   .where('company_id', '=', company.id)
      //   .andWhere('media_type', '=', 'cover')
      //   .first()
      if (company.coverId) {
        await company.load('cover')
      }

      const coverId = await MediaService.uploadSingleMedia(
        company.id,
        cover,
        'company',
        imageEntities.company.cover,
        company.cover
      )

      if (coverId) {
        company.coverId = coverId
        await company.save()
      }

      if (media) {
        // const companyMedia = await Media.query()
        //   .where('company_id', '=', company.id)
        //   .andWhere('media_type', '=', 'media')

        const { toSync, toDelete } = await MediaService.uploadMultipleMedia(
          company.id,
          media,
          'company',
          imageEntities.company.media,
          company.media
        )

        await company.related('media').sync(toSync)
        await Media.query().delete().whereIn('id', toDelete)
      }

      await company.save()
      await company.refresh()

      return company
    } catch (err) {
      Logger.error('Error updating company profile: %s', err.message)
      throw new Exception(i18next.t('company:error updating company profile'))
    }
  }

  public async searchCompanyPosts(auth: AuthContract, queryParams: any) {
    const user = auth.user as User

    try {
      if (!user.companyId) {
        throw new Exception(i18next.t('company:not company'), 422)
      }

      const posts = Post.query()
        .select('uuid', 'title', 'created_at', 'ends', 'location')
        .where('companyId', user.companyId)
        .whereNull('deletedAt')
        .orderBy('created_at', 'asc')
        .if(queryParams.q?.length > 0, (query) => {
          query.andWhere((query) => {
            query.where('title', 'ILIKE', `%${queryParams.q}%`)
          })
        })
        .paginate(
          queryParams?.page ? queryParams.page : Config.get('hnp.pagination.defaultPage'),
          queryParams?.limit ? queryParams.limit : Config.get('hnp.pagination.defaultLimit')
        )

      return posts
    } catch (err) {
      Logger.error('Error getting company posts: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }
}
