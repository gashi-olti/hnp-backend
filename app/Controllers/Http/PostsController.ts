import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostsService from 'App/Services/PostsService'
import PostValidator from 'App/Validators/PostValidator'

const postsService = new PostsService()

export default class PostsController {
  public async createPost(ctx: HttpContextContract) {
    const data = await ctx.request.validate(PostValidator)
    return postsService.createPost(ctx.auth, data)
  }
}
