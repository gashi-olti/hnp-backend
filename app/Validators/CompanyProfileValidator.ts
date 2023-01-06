import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import i18next from '@ioc:I18n/Next'
import mediaSchema from './mediaSchema'

class CompanyProfileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(120)]),
    number: schema.string.optional({ trim: true }, [rules.maxLength(35)]),
    industry: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    size: schema.number.optional(),
    founded: schema.string.optional({ trim: true }, [rules.maxLength(30)]),
    website: schema.string.optional({ trim: true }, [
      rules.maxLength(255),
      rules.url({ requireProtocol: false }),
    ]),
    description: schema.string.optional({ trim: true }, [rules.maxLength(800)]),
    specialties: schema.string.optional({ trim: true }, [rules.maxLength(800)]),
    // vat_id: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    city: schema.string({ trim: true }, [rules.maxLength(255)]),
    postal_code: schema.string({ trim: true }, [rules.maxLength(255)]),
    country: schema.string({ trim: true }, [rules.maxLength(2)]),
    phone: schema.string({ trim: true }, [rules.maxLength(35)]),
    cover: mediaSchema,
    media: schema.array.optional([rules.maxLength(4)]).members(mediaSchema),
  })

  public messages = {
    'required': i18next.t('validation:required'),
    'url': i18next.t('validation:url invalid'),
    'maxLength': i18next.t('validation:maxlength'),
    'email': i18next.t('validation:email'),
    'mobile': i18next.t('validation:phone invalid'),
    'media.maxlength': i18next.t('validation:max items'),
  }
}

export { CompanyProfileValidator }
