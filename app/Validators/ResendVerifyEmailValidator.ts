import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import i18next from '@ioc:I18n/Next'

export default class ResendVerifyEmailValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email(), rules.maxLength(255)]),
  })

  public messages = {
    '*': () => {
      return `${i18next.t('common:application error')}`
    },
  }
}
