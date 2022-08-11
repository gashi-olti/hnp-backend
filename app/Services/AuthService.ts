import User from 'App/Models/User'
import Admin from 'App/Models/Admin'
import { AuthContract, GuardsList } from '@ioc:Adonis/Addons/Auth'
import { AdminLoginValidator, LoginValidator } from 'App/Validators/LoginValidator'

export default class AuthService {
  public async attemptAdmin(auth: AuthContract, data: AdminLoginValidator['schema']['props']) {
    const { email, password } = data

    const authAdmin = auth.use('admin_api')

    const { token } = await authAdmin.attempt(email, password, { expiresIn: '1day' })
    return AuthService.getUserResponse(authAdmin.user, token)
  }

  public async attempt(auth: AuthContract, data: LoginValidator['schema']['props']) {
    const { email, password } = data

    const { token } = await auth.use('api').attempt(email, password, { expiresIn: '30days' })

    return AuthService.getUserResponse(auth.user, token)
  }

  public async login(auth: AuthContract, id: number) {
    const { token } = await auth.use('api').loginViaId(id, { expiresIn: '30days' })

    return AuthService.getUserResponse(auth.user, token)
  }

  public async logout(auth: AuthContract) {
    const guard = auth.defaultGuard as keyof GuardsList
    await auth.use(guard).revoke()
    return {
      success: true,
    }
  }

  public async checkAuthenticated(auth: AuthContract) {
    return AuthService.getUserResponse(auth.user)
  }

  public static getUserResponse = (
    user?: User | Admin,
    token?: string
  ): {
    email?: string
    isVerified?: boolean
    token?: string
    allowedProfiles?: number[]
    changedEmail?: string
    isAdmin?: boolean
  } => {
    return {
      email: user?.email,
      token,
      ...(user instanceof User && {
        isVerified: user?.verifiedAt ? true : false,
        changedEmail: user?.changedEmail || undefined,
      }),
      allowedProfiles: user?.allowedProfiles,
      // ...(user instanceof Admin && {
      //   isAdmin:
      //     user?.allowedProfiles?.length === 1 &&
      //     user.allowedProfiles[0] === User.ProfileTypes.admin,
      // }),
    }
  }
}
