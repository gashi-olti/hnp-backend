import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import i18next from '@ioc:I18n/Next'
import i18next from 'i18next'

class LoginValidator {
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
    password: schema.string({ trim: true }, [rules.minLength(8), rules.maxLength(180)]),
  })

  public messages = {
    required: i18next.t('validation:required'),
    email: i18next.t('validation:email'),
    minLength: i18next.t('validation:minlength'),
    maxLength: i18next.t('validation:maxlength'),
    exists: i18next.t('validation:email not exists'),
    enum: i18next.t('common:application error'),
  }
}

class AdminLoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
      rules.exists({
        table: 'admins',
        column: 'email',
      }),
    ]),
    password: schema.string({ trim: true }, [rules.minLength(8), rules.maxLength(255)]),
  })

  public messages = {
    required: i18next.t('validation:required'),
    email: i18next.t('validation:email'),
    minLength: i18next.t('validation:minlength'),
    maxLength: i18next.t('validation:maxlength'),
    exists: i18next.t('validation:email not exists'),
  }
}

export { LoginValidator, AdminLoginValidator }
