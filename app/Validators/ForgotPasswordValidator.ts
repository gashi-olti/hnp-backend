import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import i18next from '@ioc:I18n/Next'

export default class ForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
      rules.exists({
        table: 'users',
        column: 'email',
      }),
    ]),
  })

  public messages = {
    required: i18next.t('validation:required'),
    email: i18next.t('validation:email'),
    maxLength: i18next.t('validation:maxlength'),
    exists: i18next.t('validation:email not exists'),
  }
}
