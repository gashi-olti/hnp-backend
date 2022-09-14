import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ExperienceTypes, JobTypes } from 'App/Models/Post'

import i18next from '@ioc:I18n/Next'

export default class PostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }, [rules.maxLength(80)]),
    description: schema.string({ trim: true }, [rules.plaintextMax(1600)]),
    type: schema.number([rules.numericEnumIncludes(Object.values(JobTypes))]),
    category: schema.number(),
    location: schema.string({ trim: true }, rules.maxLength[255]),
    positions: schema.number(),
    experience: schema.number([rules.numericEnumIncludes(Object.values(ExperienceTypes))]),
    salary: schema.string({ trim: true }, [rules.maxLength(50)]),
    ends: schema.date({}, [rules.dateMax()]),
  })

  public messages = {
    required: i18next.t('validation:required'),
    maxLength: i18next.t('validation:maxlength'),
    numericEnumIncludes: i18next.t('validation:invalid selection'),
  }
}
