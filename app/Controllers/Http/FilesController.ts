import { ImageConfig } from '@ioc:Adonis/Addons/ImageConfig'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import { Exception } from '@adonisjs/core/build/standalone'
import i18next from '@ioc:I18n/Next'
import ImageUploadValidator from 'App/Validators/ImageUploadValidator'
import sharp from 'sharp'
import { validateImage } from 'Utils/FileUploadHandler/imageHelper'
import FileHandler from 'Utils/FileUploadHandler'
import FilesServicer from 'App/Services/FilesService'

const fileService = new FilesServicer()

export default class FilesController {
  public async uploadImage({ request }: HttpContextContract) {
    const entity = request.param('entity')
    const type = request.param('type')

    const imageConfig: ImageConfig = Config.get('imageConfig')
    const imageEntity = imageConfig.entities[entity]
    if (!imageEntity) {
      throw new Exception(i18next.t('validation:unknown media entity'), 422)
    }
    const imageType = imageEntity[type]

    if (!imageType) {
      throw new Exception(i18next.t('validation:unknown image type'), 422)
    }

    const { file } = await request.validate(ImageUploadValidator)

    await validateImage(sharp(file.tmpPath), imageType.validation)

    const fileName = await new FileHandler().uploadMedia(file)

    return {
      file: fileName,
    }
  }

  public async image(ctx: HttpContextContract) {
    await fileService.getImage(ctx)
  }
}
