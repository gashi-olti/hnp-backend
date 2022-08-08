import Env from '@ioc:Adonis/Core/Env'
import { I18nextConfig } from '@ioc:I18n/Next'

const i18nConfig: I18nextConfig = {
  supportedLngs: ['sq', 'en'],
  fallbackLng: 'sq',
  ns: ['common', 'validation'],
  defaultNS: 'common',
  saveMissing: true,
  interpolation: {
    prefix: '${{',
    suffix: '}}$',
  },
  debug: Env.get('I18N_DEBUG') ?? false,
}

export default i18nConfig
