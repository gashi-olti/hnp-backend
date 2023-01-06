import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostsService from 'App/Services/PostsService'
import PostValidator from 'App/Validators/PostValidator'

const postsService = new PostsService()

export default class PostsController {
  public async search(ctx: HttpContextContract) {
    const queryParams = ctx.request.qs()
    return postsService.search(queryParams)
  }

  public async createPost(ctx: HttpContextContract) {
    const data = await ctx.request.validate(PostValidator)
    return postsService.createPost(ctx.auth, data)
  }

  public async updatePost(ctx: HttpContextContract) {
    const postUuid = ctx.request.param('postUuid')
    const data = await ctx.request.validate(PostValidator)
    return postsService.updatePost(ctx.auth, postUuid, data)
  }

  public async getPostForCompany(ctx: HttpContextContract) {
    const postUuid = ctx.request.param('postUuid')
    return postsService.getPostForCompany(postUuid, ctx.auth)
  }

  public async deletePost(ctx: HttpContextContract) {
    const postUuid = ctx.request.param('postUuid')
    return postsService.deletePost(ctx.bouncer, postUuid)
  }

  public async getPost(ctx: HttpContextContract) {
    const postUuid = ctx.request.param('uuid')
    return postsService.getPost(postUuid, ctx.auth)
  }
}
