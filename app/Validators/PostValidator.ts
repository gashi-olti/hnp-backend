import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { JobTypes } from 'App/Models/Post'

import i18next from '@ioc:I18n/Next'

export default class PostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }, [rules.maxLength(80)]),
    description: schema.string({ trim: true }, [rules.plaintextMax(4000)]),
    type: schema.number([rules.numericEnumIncludes(Object.values(JobTypes))]),
    category: schema.number(),
    location: schema.string({ trim: true }, rules.maxLength[255]),
    positions: schema.number(),
    experience: schema.string.optional({ trim: true }, rules.maxLength[50]),
    salary: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    ends: schema.date({ format: 'dd-MM-yyyy' }, [rules.dateMax()]),
  })

  public messages = {
    required: i18next.t('validation:required'),
    maxLength: i18next.t('validation:maxlength'),
    numericEnumIncludes: i18next.t('validation:invalid selection'),
  }
}
