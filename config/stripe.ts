import Env from '@ioc:Adonis/Core/Env'
import { StripeConfig } from '@ioc:Hnp/Stripe'

const stripeConfig: StripeConfig = {
  secretKey: Env.get('STRIPE_SECRET_KEY') as string,
  publicKey: Env.get('STRIPE_PUBLIC_KEY') as string,
  webhookSecret: Env.get('STRIPE_WEBHOOK_SECRET') as string,

  options: {
    apiVersion: Env.get('STRIPE_API_VERSION', null) as string,
    typescript: Env.get('STRIPE_TYPESCRIPT', true) as boolean,
  },
}

export default stripeConfig
