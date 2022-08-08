import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import i18next from '@ioc:I18n/Next'

export default class Language {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const lang = request.header('x-language')

    if (lang && lang !== i18next.language) {
      await i18next.changeLanguage(lang)
    }

    await next()
  }
}
