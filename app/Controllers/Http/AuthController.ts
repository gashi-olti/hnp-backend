import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from 'App/Services/AuthService'
import { LoginValidator, AdminLoginValidator } from 'App/Validators/LoginValidator'

const authService = new AuthService()

export default class AuthController {
  public async login(ctx: HttpContextContract) {
    const data = await ctx.request.validate(LoginValidator)
    return authService.attempt(ctx.auth, data)
  }

  public async loginAdmin(ctx: HttpContextContract) {
    const data = await ctx.request.validate(AdminLoginValidator)
    return authService.attemptAdmin(ctx.auth, data)
  }

  public async logout(ctx: HttpContextContract) {
    return authService.logout(ctx.auth)
  }

  public async checkAuthenticated(ctx: HttpContextContract) {
    return authService.checkAuthenticated(ctx.auth)
  }
}
