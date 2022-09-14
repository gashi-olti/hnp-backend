import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'

export enum JobTypes {
  fullTime = 1,
  partTime,
  internship,
}

export enum ExperienceTypes {
  zeroToOneYear = 1,
  oneToTwoYears,
  twoToThreeYears,
  threeToFourYears,
  fiveToTenYears,
  tenPlusYears,
}

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public companyId: number

  @hasOne(() => Company, {
    serializeAs: null,
    foreignKey: 'id',
    localKey: 'companyId',
  })
  public company: HasOne<typeof Company>

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public type: number

  @column()
  public category: number

  @column()
  public location: string

  @column()
  public positions: number

  @column()
  public experience: number

  @column()
  public salary: string

  @column()
  public ends: string | DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
