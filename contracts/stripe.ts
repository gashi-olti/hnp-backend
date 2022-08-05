declare module '@ioc:Hnp/Stripe' {
  import Stripe from 'stripe'

  export interface StripeConfig {
    secretKey: string
    publicKey: string
    webhookSecret: string

    options: {
      apiVersion: string
      typescript?: boolean
    }
  }

  const stripe: Stripe

  export default stripe
}
