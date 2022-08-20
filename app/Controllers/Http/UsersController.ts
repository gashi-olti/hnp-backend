import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersService from 'App/Services/UsersService'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import ResetPasswordValidator from 'App/Validators/ResetPassword'
import VerifyEmailValidator from 'App/Validators/VerifyEmailValidator'

const usersService = new UsersService()

export default class UsersController {
  public async register(ctx: HttpContextContract) {
    const body = await ctx.request.validate(RegisterValidator)
    return usersService.register(ctx.auth, body)
  }

  public async verifyEmail(ctx: HttpContextContract) {
    const data = await ctx.request.validate(VerifyEmailValidator)
    return usersService.verifyEmail(ctx.auth, data)
  }

  public async forgotPassword(ctx: HttpContextContract) {
    const data = await ctx.request.validate(ForgotPasswordValidator)
    return usersService.forgotPassword(data)
  }

  public async resetPassword(ctx: HttpContextContract) {
    const data = await ctx.request.validate(ResetPasswordValidator)
    return usersService.resetPassword(data)
  }
}
