import { AbstractFileUploadHandler } from './FileHandler.interface'
import { promises as fs, existsSync, mkdirSync, createWriteStream } from 'fs'
import { UploadConfig } from '@ioc:Adonis/Addons/UploadConfig'
import Config from '@ioc:Adonis/Core/Config'
import { v4 as uuid } from 'uuid'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { Exception } from '@adonisjs/core/build/standalone'
import Application from '@ioc:Adonis/Core/Application'
import i18next from '@ioc:I18n/Next'
import Logger from '@ioc:Adonis/Core/Logger'
import { PassThrough } from 'stream'
import * as mime from 'mime-types'

export default class LocalFileHandler implements AbstractFileUploadHandler {
  private uploadConfig: UploadConfig

  constructor() {
    this.uploadConfig = Config.get('uploadConfig')
  }

  public async uploadMedia(media: MultipartFileContract) {
    if (!media) {
      throw new Exception(i18next.t('validation:no media to upload'), 404)
    }
    const { extname } = media
    const fileName = `${uuid()}.${extname}`

    try {
      await media.move(Application.tmpPath('uploads', this.uploadConfig.tmp), {
        name: fileName,
      })

      return [this.uploadConfig.tmp, fileName].join('/')
    } catch (error) {
      throw new Exception(i18next.t('validation:error uploading media'), 500)
    }
  }

  public async updateOrDeleteMedia(
    newFile: string | undefined,
    oldFile: string | null | undefined
  ) {
    if (!newFile && !oldFile) return null

    const newFileName = newFile?.split('/').pop()
    if (newFileName === oldFile) {
      return newFileName ?? null
    }

    const fileName = newFileName ?? null
    if (fileName && newFile && newFile.includes(`${this.uploadConfig.tmp}/`)) {
      if (oldFile) {
        await this.deleteMedia(oldFile)
      }
      return this.moveMedia(newFile)
    } else if (!fileName && oldFile) {
      await this.deleteMedia(oldFile)
    }

    return fileName
  }

  public async moveMedia(media: string) {
    const name = media.split('/').pop() ?? ''
    const tmpName = [this.uploadConfig.tmp, name].join('/')

    if (!(await this.fileExists(tmpName))) {
      throw new Exception(i18next.t('validation:no media found'), 404)
    }

    // Create directories if not exists already
    try {
      await fs.mkdir(Application.tmpPath('uploads', this.uploadConfig.original))
    } catch (e) {}
    try {
      await fs.mkdir(Application.tmpPath('uploads', this.uploadConfig.upload))
    } catch (e) {}

    try {
      await fs.rename(
        Application.tmpPath('uploads', tmpName),
        Application.tmpPath('uploads', this.uploadConfig.original, name)
      )

      return name
    } catch (error) {
      Logger.error('Error while moving the media: %s', error.message)
      throw new Exception(i18next.t('validation:error saving media'), 500)
    }
  }

  public async deleteMedia(media: string) {
    const name = media.split('/').pop() ?? ''

    try {
      const files: string[] = []
      files.push([this.uploadConfig.original, name].join('/'))

      const deleteBatch: Promise<void>[] = []
      files.forEach((filePath) => {
        deleteBatch.push(this.deleteFileSilently(filePath))
      })
      try {
        // deleteBatch will throw the error of the deleteFileSilently promises here and not be cought inside the deleteFileSilently function. This workaround does the same as fail silent.
        await Promise.all(deleteBatch)
      } catch (error) {}
    } catch (error) {
      Logger.error('Error while deleting the media: %s', error.message)
      throw new Exception(i18next.t('validation:error deleting media'), 500)
    }
  }

  public async deleteCache(name: string) {
    try {
      await this.deleteFileSilently([this.uploadConfig.cache, name].join('/'))
    } catch (error) {}
  }

  public uploadFromStream(
    file?: string,
    _contentType?: string | false
  ): { writeStream: PassThrough; promise: Promise<string> } {
    if (!file) {
      throw new Exception(i18next.t('validation:no file to upload'), 404)
    }
    if (file) {
      try {
        mkdirSync(Application.tmpPath('uploads', file.substring(0, file.lastIndexOf('/'))))
      } catch (e) {}
    }

    const fileName = file ? file : uuid()

    const pass = new PassThrough()
    const path = Application.tmpPath('uploads', fileName)

    const writeStream = createWriteStream(path)

    pass.pipe(writeStream)

    return {
      writeStream: pass,
      promise: new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          resolve(fileName)
        })
        writeStream.on('error', reject)
      }),
    }
  }

  public getMimeType = async (file: string): Promise<string> =>
    new Promise((resolve) => resolve(mime.lookup(file) || ''))

  public async readFile(file: string): Promise<{ file: string }> {
    return { file: Application.tmpPath('uploads', file) }
  }

  public async readFileAsBuffer(file: string): Promise<Buffer> {
    try {
      return fs.readFile(Application.tmpPath('uploads', file))
    } catch (error) {
      Logger.error('Error reading file "%s" as buffer: %s', file, error.message)
      throw new Exception(i18next.t('validation:file not found'), 404)
    }
  }

  public async fileExists(file: string): Promise<boolean> {
    return existsSync(Application.tmpPath('uploads', file))
  }

  private async deleteFileSilently(path: string) {
    try {
      return fs.unlink(Application.tmpPath('uploads', path))
    } catch (error) {}
  }
}
