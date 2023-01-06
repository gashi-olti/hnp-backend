import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import i18next from '@ioc:I18n/Next'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string({ trim: true }, [
      rules.exists({
        table: 'users',
        column: 'verification_token',
        whereNot: { verification_created_at: null },
      }),
    ]),
    password: schema.string({ trim: true }, [rules.minLength(8), rules.maxLength(180)]),
  })

  public messages = {
    'required': i18next.t('validation:required'),
    'minLength': i18next.t('validation:minlength'),
    'maxLength': i18next.t('validation:maxlength'),
    'token.required': i18next.t('common:application error'),
    'token.exists': i18next.t('validation:invalid token'),
  }
}
