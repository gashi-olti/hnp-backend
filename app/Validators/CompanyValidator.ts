import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import i18next from '@ioc:I18n/Next'
import mediaSchema from './mediaSchema'

class CompanyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    company_name: schema.string({ trim: true }, [rules.maxLength(255)]),
    company_number: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    company_size: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    company_description: schema.string.optional({ trim: true }, [rules.maxLength(800)]),
    vat_id: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    city: schema.string({ trim: true }, [rules.maxLength(255)]),
    postal_code: schema.string({ trim: true }, [rules.maxLength(255)]),
    country: schema.enum(['AL', 'XK'] as const),
    phone: schema.string({ trim: true }, [rules.mobile({ strict: true }), rules.maxLength(255)]),
    website: schema.string.optional({ trim: true }, [
      rules.maxLength(255),
      rules.url({ requireProtocol: false }),
    ]),
    cover: mediaSchema,
    media: schema.array.optional([rules.maxLength(4)]).members(mediaSchema),
  })

  public messages = {
    'required': i18next.t('validation:required'),
    'url': i18next.t('validation:url invalid'),
    'maxLength': i18next.t('validation:maxlength'),
    'media.maxlength': i18next.t('validation:max items'),
  }
}

export { CompanyValidator }
