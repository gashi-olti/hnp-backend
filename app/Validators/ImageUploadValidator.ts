import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import i18next from '@ioc:I18n/Next'

export default class ImageUploadValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      size: '32mb',
      extnames: ['png', 'jpg', 'jpeg', 'tiff', 'webp'],
    }),
  })

  public messages = {
    'file.required': i18next.t('validation:image required'),
    'file.file.extnames': i18next.t('validation:image extnames'),
    'file.file.size': i18next.t('validation:max image size'),
  }
}
