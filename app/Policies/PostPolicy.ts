import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export default class PostPolicy extends BasePolicy {
  public async get(user: User, post: Post) {
    if (post.companyId === user.companyId) {
      return true
    }

    return false
  }

  public async update(user: User, post: Post) {
    if (!user.companyId) {
      return false
    }

    if (user.companyId !== post.companyId) {
      return false
    }

    return true
  }

  public async delete(user: User, post: Post) {
    if (!user.companyId) {
      return false
    }

    if (user.companyId !== post.companyId) {
      return false
    }

    return true
  }

  public async publish(user: User, post: Post) {
    if (!user.companyId) {
      return false
    }

    if (user.companyId !== post.companyId) {
      return false
    }

    return true
  }
}
