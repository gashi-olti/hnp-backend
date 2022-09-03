import { Exception } from '@adonisjs/core/build/standalone'
import Logger from '@ioc:Adonis/Core/Logger'
import { UploadConfig } from '@ioc:Adonis/Addons/UploadConfig'
import Config from '@ioc:Adonis/Core/Config'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FileHandler from 'Utils/FileUploadHandler'
import Env from '@ioc:Adonis/Core/Env'
import { ImageVariant, VariantConfig } from '@ioc:Adonis/Addons/VariantConfig'
import sharp from 'sharp'
import { createVariant } from 'Utils/FileUploadHandler/imageHelper'
import i18next from '@ioc:I18n/Next'
import { Duplex } from 'stream'

export default class FilesServicer {
  private uploadConfig: UploadConfig

  constructor() {
    this.uploadConfig = Config.get('uploadConfig')
  }

  public async getImage({ request, response }: HttpContextContract) {
    const fileHandler = new FileHandler()

    try {
      const filename = request.param('filename')
      const originalFile = [this.uploadConfig.original, filename].join('/')

      if (!(await fileHandler.fileExists(originalFile))) {
        response.status(404)
        response.send('Not Found')
        return
      }

      const queryParams = request.qs()
      const qsVariant = queryParams.v

      const variantConfig: VariantConfig = Config.get('variantConfig')

      const variants = variantConfig.variants
      const baseVariant = variantConfig.base

      const variantExists = variants.find((item) => item.name === qsVariant.name)
      const variant = variantExists ? variantExists : baseVariant

      const fileName = [this.uploadConfig.variants, `${variant.name}-${filename}`].join('/')

      if (!(await fileHandler.fileExists(fileName))) {
        await this.generateVariant(variant, originalFile, fileName)
      }

      if (Env.get('NODE_ENV') !== 'production') {
        const fileData = await fileHandler.readFile(fileName)
        if (typeof fileData.file === 'string') {
          response.attachment(fileData.file)
        }
      } else {
        response.redirect(Env.get('MEDIA_BUCKET_URL') + fileName)
      }
    } catch (error) {
      response.status(error.code === 'ENOENT' ? 404 : 500)
      response.send('Cannot process file')
    }
  }

  public generateVariant = async (variant: ImageVariant, sourceFile: string, destFile: string) => {
    const fileHandler = new FileHandler()
    try {
      const fileName = sourceFile.split('/').pop() as string
      const buffer = await fileHandler.readFileAsBuffer(sourceFile)

      const image = sharp(buffer)
      await new Promise<string>((resolve, reject) => {
        try {
          createVariant(image, destFile, variant, async (buffer) => {
            const { writeStream, promise } = await fileHandler.uploadFromStream(
              destFile,
              await fileHandler.getMimeType(fileName)
            )
            const stream = await this.streamFromBuffer(buffer)
            stream.pipe(writeStream)
            const newFileName = await promise

            resolve(newFileName)
          })
        } catch (error) {
          reject(error)
        }
      })
    } catch (error) {
      Logger.error('Error generating image variant invoice PDF: %s', error.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public streamFromBuffer = async (buffer) => {
    let stream = new Duplex()
    stream.push(Buffer.from(await buffer))
    stream.push(null)
    return stream
  }
}
