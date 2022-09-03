import { Exception } from '@adonisjs/core/build/standalone'
import Logger from '@ioc:Adonis/Core/Logger'
import i18next from '@ioc:I18n/Next'
import { ImageType } from '@ioc:Adonis/Addons/ImageConfig'
import { LucidModel, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Media from 'App/Models/Media'
import FileHandler from 'Utils/FileUploadHandler'

interface MediaBody {
  uuid?: string
  source?: string
  title?: string
  credit?: string
  order?: number
}

const fileHandler = new FileHandler()

export default class MediaService {
  public static async uploadSingleMedia(
    companyId: number,
    body: MediaBody | undefined,
    entity: string,
    type: ImageType,
    existingMedia: Media | null
  ) {
    const file = await fileHandler.updateOrDeleteMedia(body?.source, existingMedia?.source)

    if (!file && existingMedia) {
      await existingMedia.delete()
      return null
    } else if (body && file) {
      const mimeType = await fileHandler.getMimeType(file)

      const defaultValues = {
        title: null,
        credit: null,
      }

      const mediaObject = {
        ...(file && { source: file }),
        companyId,
        title: body?.title,
        credit: body?.credit,
        entity,
        mediaType: type.name,
        mimeType,
      }

      if (existingMedia) {
        existingMedia.merge({ ...defaultValues, ...mediaObject })
        await existingMedia.save()
        return existingMedia.id
      } else {
        const media = await Media.create(mediaObject)
        return media.id
      }
    }

    return null
  }

  public static async uploadMultipleMedia(
    companyId: number,
    body: (MediaBody | undefined)[],
    entity: string,
    type: ImageType,
    existingMedia: ManyToMany<typeof Media, LucidModel> | null
  ) {
    const toCreate: any[] = []
    const toUpdate: any[] = []

    const updateMedia = body.filter((media) => media?.uuid).map((media) => media?.uuid)
    const missingMedia = existingMedia?.filter((media) => !updateMedia.includes(media.uuid)) ?? []

    for (const media of missingMedia) {
      await fileHandler.deleteMedia(media.source)
    }

    const toDelete: number[] = [...missingMedia.map((media) => media.id)]

    for await (const mediaItem of body) {
      if (mediaItem) {
        const existing = existingMedia?.find((existing) => existing.uuid === mediaItem?.uuid)

        const file = await fileHandler.updateOrDeleteMedia(mediaItem?.source, existing?.source)

        if (!file && existing) {
          toDelete.push(existing?.id)
        } else if (file) {
          const mimeType = await fileHandler.getMimeType(file)

          const defaultValues = {
            title: null,
            credit: null,
          }

          const mediaObject = {
            ...(file && { source: file }),
            companyId,
            title: mediaItem.title,
            entity,
            medieType: type.name,
            credit: mediaItem?.credit,
            mimeType,
          }
          if (existing?.id) {
            toUpdate.push({ id: existing?.id, ...defaultValues, ...mediaObject })
          } else {
            toCreate.push(mediaObject)
          }
        }
      }
    }

    const toSync: number[] = []
    const created = await Media.createMany(toCreate)
    const updated = await Media.updateOrCreateMany('id', toUpdate)

    toSync.push(...created.map((media) => media.id), ...updated.map((media) => media.id))

    return {
      toSync: toSync.reduce(
        (synced, curr) => ({
          ...synced,
          [curr]: {
            type: type.name,
          },
        }),
        {}
      ),
      toDelete,
    }
  }

  public async getIdsToSync(mediaItems: string[] | undefined) {
    try {
      if (!mediaItems?.length) {
        return []
      }
      const mediaItemRaw = await Media.query().whereIn('uuid', mediaItems)
      return mediaItemRaw.map((media) => media.id)
    } catch (err) {
      Logger.error('Error getting companies id for sync: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }
}
