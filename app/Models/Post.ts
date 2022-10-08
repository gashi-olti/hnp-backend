import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'

export enum JobTypes {
  fullTime = 1,
  partTime,
  internship,
}

export default class Post extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column({ serializeAs: null })
  public companyId: number

  // @hasOne(() => Company, {
  //   serializeAs: null,
  //   foreignKey: 'id',
  //   localKey: 'companyId',
  // })
  // public company: HasOne<typeof Company>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

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
  public experience: string

  @column()
  public salary: string

  @column()
  public ends: string | DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
