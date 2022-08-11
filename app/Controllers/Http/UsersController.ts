import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersService from 'App/Services/UsersService'
import RegisterValidator from 'App/Validators/RegisterValidator'

const usersService = new UsersService()

export default class UsersController {
  public async register(ctx: HttpContextContract) {
    const body = await ctx.request.validate(RegisterValidator)
    return usersService.register(ctx.auth, body)
  }
}
