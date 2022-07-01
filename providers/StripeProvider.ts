import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import Stripe from 'stripe'

export default class StripeProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Hnp/Stripe', () => {
      const { secretKey, options } = this.app.container.use('Adonis/Core/Config').get('stripe')

      return new Stripe(secretKey, options)
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
