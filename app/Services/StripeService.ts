import Env from '@ioc:Adonis/Core/Env'
import stripe from '@ioc:Hnp/Stripe'
import Company from 'App/Models/Company'

export default class StripeService {
  public getConfig = () => {
    return {
      publishableKey: Env.get('STRIPE_PUBLIC_KEY'),
    }
  }

  public async listPrices() {
    const { data } = await stripe.prices.list({
      // don't return archived prices
      active: true,
      expand: ['data.product'],
    })

    const current: any[] = data
      .sort((a: any, b: any) => b.created - a.created)
      .reduce((curr: any[], next: any) => {
        const found = curr.find((price) => price.product.id === next.product.id)
        if (!found) {
          curr.push(next)
        }
        return curr
      }, [])
      .sort((a: any, b: any) => a.product.metadata.order - b.product.metadata.order)

    return { current, all: data }
  }

  public async createCustomer(email: string, company: Company) {
    const customer = await stripe.customers.create({
      name: company.companyName,
      email: email,
      // tax_exempt: company.tax_exempt
      address: {
        line1: company.street,
        city: company.city,
        postal_code: company.postalCode,
        country: company.country,
      },
      // preferred_locales: ['de-DE']
    })

    // if (company.vatId) {
    //   await stripe.customers.createTaxId(company.id, this.getTaxId(company))
    // }

    return customer
  }

  public getPrice(priceId: string) {
    return stripe.prices.retrieve(priceId)
  }

  public getProduct(productId: string) {
    return stripe.products.retrieve(productId)
  }

  public listInvoicesBySubscription(subscriptionId: string) {
    return stripe.invoices.list({
      subscription: subscriptionId,
    })
  }

  public listActiveSubscriptionsByCustomer(customerId: string) {
    return stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    })
  }

  public getInvoice(id: string) {
    return stripe.invoices.retrieve(id)
  }

  public getBalance(id: string) {
    return stripe.balance.retrieve({
      stripeAccount: id,
    })
  }

  public async getBalanceTotal(id: string): Promise<number> {
    const stripeBalance = await this.getBalance(id)
    return stripeBalance.available[0].amount + stripeBalance.pending[0].amount
  }
}
