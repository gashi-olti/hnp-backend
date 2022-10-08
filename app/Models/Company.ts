import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  computed,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'

// import Subscription from './Subscription'
import { getSlug } from 'Utils/utils'
import Media from './Media'
// import StripeService from 'App/Services/StripeService'

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
  public name: string

  @column()
  public number: string

  @column()
  public industry: string

  @column()
  public size: number

  @column()
  public founded: string

  @column()
  public website: string

  @column()
  public description: string

  @column()
  public specialties: string

  // @hasMany(() => Post)
  // public posts: HasMany<typeof Post>

  /**
   * Vat does not exist for non eu-countries
   */
  // @column()
  // public vatId: string

  @column()
  public city: string

  @column()
  public postalCode: string

  @column()
  public country: string

  @column()
  public phone: string

  @column({ serializeAs: null })
  public coverId: number | null

  @hasOne(() => Media, {
    localKey: 'coverId',
    foreignKey: 'id',
  })
  public cover: HasOne<typeof Media>

  @manyToMany(() => Media, {
    pivotTable: 'media_companies',
    pivotColumns: ['type'],
    onQuery: (query) => query.where('type', 'media'),
  })
  public media: ManyToMany<typeof Media>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // @hasOne(() => Subscription)
  // public subscription: HasOne<typeof Subscription>

  // @afterFind()
  // public static async getSubscription(company: Company) {
  //   if (company.id) {
  //     await company.load('subscription', (query) => {
  //       query.whereNotIn('status', ['incomplete', 'canceled'])
  //     })
  //     if (company.subscription) {
  //       const product = await new StripeService().getProduct(company.subscription.stripeProductId)
  //       company.subscription.$sideloaded = { eventLimit: product.metadata.events }
  //     }
  //   }
  // }

  @computed()
  public get slug(): string | undefined {
    return getSlug([this.name], this.id, 'companies')
  }

  @computed()
  public get profileComplete(): boolean | undefined {
    if (this.stripeCustomerId) {
      return true
    }
    return undefined
  }
}
