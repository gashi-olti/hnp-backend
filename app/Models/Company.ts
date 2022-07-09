import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne, computed, afterFind } from '@ioc:Adonis/Lucid/Orm'

import Subscription from './Subscription'
import { getSlug } from 'Utils/utils'

export default class Company extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column({ serializeAs: null })
  public stripeAccountId: string | null

  @column({ serializeAs: null })
  public stripeCustomerId: string | null

  @column()
  public companyName: string

  @column()
  public companyNumber: string

  @column()
  public companyDescription: string

  @column()
  public companySize: string

  @column()
  public vatId: string

  @column()
  public street: string

  @column()
  public city: string

  @column()
  public postalCode: string

  @column()
  public country: string

  @column()
  public phone: string

  @column()
  public website: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Subscription)
  public subscription: HasOne<typeof Subscription>

  @afterFind()
  public static async getSubscription(company: Company) {
    if (company.id) {
      await company.load('subscription', (query) => {
        query.whereNotIn('status', ['incomplete', 'canceled'])
      })
      if (company.subscription) {
        const product = await new StripeService().getProduct(company.subscription.stripeProductId)
        company.subscription.$sideloaded = { eventLimit: product.metadata.events }
      }
    }
  }

  @computed()
  public get slug(): string | undefined {
    return getSlug([this.companyName], this.id, 'companies')
  }

  @computed()
  public get profileComplete(): boolean | undefined {
    if (this.stripeCustomerId) {
      return true
    }
    return undefined
  }
}
