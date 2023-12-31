// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import PostValidator from 'App/Validators/PostValidator'
import User from 'App/Models/User'
import i18next from '@ioc:I18n/Next'
import Logger from '@ioc:Adonis/Core/Logger'
import Post from 'App/Models/Post'
import { ActionsAuthorizerContract } from '@ioc:Adonis/Addons/Bouncer'
import Admin from 'App/Models/Admin'
import { DateTime } from 'luxon'

export default class PostsService {
  public async search(queryParams: any) {
    try {
      const order = 'title'
      const direction = 'asc'

      const posts = await Post.query()
        .select('id', 'uuid', 'company_id', 'title', 'type', 'category', 'location', 'ends')
        .orderBy(order, direction)
        .whereNull('deleted_at')
        .where('ends', '>', DateTime.local().setZone('Europe/Zagreb').toSQLDate())
        .preload('company', (query) => {
          query.preload('cover')
        })
        .if(queryParams.category?.length > 0, (query) => {
          const categories = queryParams.category.split(',')
          categories.map((c: number) => query.where('category', '=', c))
        })
        .if(queryParams.type?.length > 0, (query) => {
          const types = queryParams.type.split(',')
          types.map((t: number) => query.where('type', '=', t))
        })
        .if(queryParams.q?.length > 0, (query) => {
          query.andWhere((query) => {
            query.where('title', 'ILIKE', `%${queryParams.q}%`)
          })
        })

      return Array.from(
        await Promise.all(
          posts.map(async (post) =>
            post.serialize({
              relations: {
                company: { fields: { pick: ['name', 'cover'] } },
              },
            })
          )
        )
      )
    } catch (err) {
      Logger.error('Error searching posts: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async createPost(auth: AuthContract, data: PostValidator['schema']['props']) {
    const user = auth.user as User

    try {
      if (!user.companyId) {
        throw new Exception(i18next.t('company:not company'), 422)
      }

      const post = await Post.create({ companyId: user.companyId, ...data })

      await post.save()

      return PostsService.getPostResponse(post)
    } catch (err) {
      Logger.error('Error creating post: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async updatePost(
    auth: AuthContract,
    postUuid: string,
    data: PostValidator['schema']['props']
  ) {
    const post = await Post.findByOrFail('uuid', postUuid)
    const user = auth.user as User

    try {
      if (!user.companyId || user.companyId !== post.companyId) {
        throw new Exception(i18next.t('company:not company'), 422)
      }

      const optionalValues = {
        experience: null,
        salary: null,
      }

      post.merge({ ...optionalValues, ...data })
      await post.save()
      await post.refresh()

      return PostsService.getPostResponse(post)
    } catch (err) {
      Logger.error('Error updating post: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async getPostForCompany(postUuid: string, auth: AuthContract) {
    const post = await Post.findByOrFail('uuid', postUuid)
    const user = auth.user as User

    try {
      if (!user.companyId || user.companyId !== post.companyId) {
        throw new Exception(i18next.t('company:not company'), 422)
      }

      return PostsService.getPostResponse(post)
    } catch (err) {
      Logger.error('Error getting post: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async deletePost(bouncer: ActionsAuthorizerContract<User | Admin>, postUuid: string) {
    try {
      const post = await Post.findByOrFail('uuid', postUuid)

      await bouncer.with('PostPolicy').authorize('delete', post)

      post.merge({
        deletedAt: DateTime.utc(),
      })

      await post.save()

      return { success: true }
    } catch (err) {
      Logger.error('Error deleting post: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async getPost(postUuid: string, auth: AuthContract) {
    try {
      await auth.use('api').check()

      const post = await Post.query()
        .where('uuid', postUuid)
        .whereNull('deleted_at')
        .if(auth.use('api').isGuest, (query) => {
          query.where('ends', '>', DateTime.utc().setZone('Europe/Zagreb').toSQLDate())
        })
        .firstOrFail()

      return PostsService.getPostResponse(post)
    } catch (err) {
      Logger.error('Error getting post: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public static async getPostResponse(post: Post) {
    await post.refresh()

    await post.load('company', (query) => {
      query.select('uuid', 'name')
    })

    if (post.companyId) {
      await post.load('company', (query) => {
        query.preload('cover')
      })
    }

    return {
      ...post.serialize({
        fields: { omit: ['allEntitiesActioned', 'allEntitiesVerified'] },
        relations: { company: { fields: { pick: ['uuid'] } } },
      }),
    }
  }
}
