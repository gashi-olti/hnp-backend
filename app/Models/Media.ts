import { DateTime } from 'luxon'
import { BaseModel, column, computed, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Config from '@ioc:Adonis/Core/Config'
import Env from '@ioc:Adonis/Core/Env'
import { ImageEntities } from '@ioc:Adonis/Addons/ImageConfig'
import Company from './Company'

export default class Media extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
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

  @column({ serialize: (value) => (value ? value : undefined) })
  public title: string | null

  @column()
  public source: string

  @column({ serializeAs: null })
  public entity: string

  @column({ serializeAs: null })
  public mediaType: string

  @column({ serializeAs: 'type' })
  public mimeType?: string

  @column({ serialize: (value) => (value ? value : undefined) })
  public credit: string | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @computed()
  public get src(): string | undefined {
    const imageEntities: ImageEntities = Config.get('imageConfig.entities')

    if (imageEntities[this.entity]) {
      for (const [, entity] of Object.entries(imageEntities[this.entity])) {
        if (entity.name === this.mediaType) {
          return [Env.get('MEDIA_IMAGE_URL'), this.source].join('/')
        }
      }
    }

    return undefined
  }
}
