import { DateTime } from 'luxon'
import { column, BaseModel, beforeSave, computed } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import User from './User'

export default class Admin extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get allowedProfiles(): number[] | undefined {
    return [User.ProfileTypes.admin]
  }

  @beforeSave()
  public static async hashPassword(admin: Admin): Promise<void> {
    if (admin.$dirty.password) {
      admin.password = await Hash.make(admin.password)
    }
  }
}
