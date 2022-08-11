import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import i18next from '@ioc:I18n/Next'
import User from 'App/Models/User'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
      rules.unique({
        table: 'users',
        column: 'email',
      }),
    ]),
    password: schema.string({ trim: true }, [rules.minLength(8), rules.maxLength(180)]),
    profile_type: schema.enum(Object.values(User.ProfileTypes)),
  })

  public messages = {
    'required': i18next.t('validation:required'),
    'email': i18next.t('validation:email'),
    'minLength': i18next.t('validation:minlength'),
    'maxLength': i18next.t('validation:maxlength'),
    'unique': i18next.t('validation:email exists'),
    'profile_type.required': i18next.t('common:application error'),
    'enum': i18next.t('common:application error'),
  }
}
