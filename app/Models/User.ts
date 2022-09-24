import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { string } from '@ioc:Adonis/Core/Helpers'
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  hasOne,
  HasOne,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Company from './Company'

enum ProfileTypes {
  company = 1,
  admin,
}

export default class User extends BaseModel {
  public static readonly ProfileTypes = ProfileTypes

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column({ serializeAs: null })
  public companyId: number

  @hasOne(() => Company, {
    serializeAs: null,
    foreignKey: 'id',
    localKey: 'companyId',
  })
  public company: HasOne<typeof Company>

  @column()
  public email: string

  @column()
  public changedEmail: string | null

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public verificationToken: string | null

  @column()
  public blockedEmail: DateTime

  @column()
  public blockedEmailCause: string

  // TODO: MFR - change this to timestamp, terms can change and we must check if the user has acepted the latest version
  @column()
  public termsAccepted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public verificationCreatedAt: DateTime | null

  @column.dateTime()
  public verifiedAt: DateTime | null

  @beforeCreate()
  public static setVerificationToken(user: User): void {
    user.verificationToken = string.generateRandom(20)
    user.verificationCreatedAt = DateTime.utc()
  }

  public setVerificationToken(): void {
    this.verificationToken = string.generateRandom(20)
    this.verificationCreatedAt = DateTime.utc()
  }

  @beforeSave()
  public static async hashPassword(user: User): Promise<void> {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @computed()
  public get allowedProfiles(): number[] | undefined {
    const allowed: number[] = []

    const profiles = Object.keys(ProfileTypes).filter((key) => isNaN(Number(key)))

    profiles.forEach((profile: any) => {
      if (this[`${profile}Id`]) {
        allowed.push(Number(ProfileTypes[profile]))
      }
    })

    if (!allowed.length) {
      return undefined
    }

    return allowed
  }

  public isInvalidToken(): boolean {
    return (
      !this.verificationCreatedAt || DateTime.utc().minus({ days: 2 }) > this.verificationCreatedAt
    )
  }

  public async revokeUserTokens(): Promise<void> {
    await Database.from('api_tokens').where('user_id', this.id).delete()
  }
}
