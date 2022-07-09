import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  computed,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import { softDelete, softDeleteQuery } from '../Services/SoftDelete'

enum SubscriptionTypes {
  basic = 1,
  premium,
}

export default class Subscription extends BaseModel {
  public static readonly SubscriptionTypes = SubscriptionTypes

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column({ serializeAs: null })
  public companyId: number

  @column({ serializeAs: null })
  public subscriptiontypeId: number

  @column({ serializeAs: null })
  public stripeSubscriptionId: string

  @column({ serializeAs: null })
  public stripePaymentMethodId: string

  @column()
  public stripePriceId: string

  @column()
  public platformFee: number

  @column()
  public stripeProductId: string

  @column()
  public taxExempt: string

  @column()
  public last4: string

  @column()
  public cardBrand: string

  @column()
  public amount: number

  @column()
  public interval: string | null

  @column()
  public status:
    | 'active'
    | 'past_due'
    | 'unpaid'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'

  @column.dateTime()
  public currentPeriodEnd: DateTime

  @column.dateTime()
  public currentPeriodStart: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get name(): string {
    return SubscriptionTypes[this.subscriptiontypeId]
  }

  @computed()
  public get eventLimit(): number | undefined {
    return this.$sideloaded.eventLimit ? Number(this.$sideloaded.eventLimit) : undefined
  }

  @beforeFind()
  @beforeFetch()
  public static softDeletesFind = (query: ModelQueryBuilderContract<typeof Subscription>) => {
    softDeleteQuery(query)
  }

  public delete = (): Promise<void> => softDelete(this)
}
