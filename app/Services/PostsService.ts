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

      post.merge(data)
      await post.save()

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

  public static async getPostResponse(post: Post) {
    await post.refresh()

    await post.load('company', (query) => {
      query.select('uuid', 'name')
    })

    return {
      ...post.serialize({
        fields: { omit: ['allEntitiesActioned', 'allEntitiesVerified'] },
        relations: { company: { fields: { pick: ['uuid'] } } },
      }),
    }
  }
}
