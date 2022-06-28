import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import i18next from 'i18next'

import Backend from 'i18next-fs-backend'

export default class I18nNextProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('I18n/Next', () => {
      const config = this.app.container.use('Adonis/Core/Config').get('i18next')

      i18next.use(Backend).init({
        backend: {
          loadPath: 'locales/${{lng}}$/${{ns}}$.json',
          addPath: 'locales/${{lng}}$/${{ns}}$.needtranslation.json',
        },
        ...config,
      })

      return i18next
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
