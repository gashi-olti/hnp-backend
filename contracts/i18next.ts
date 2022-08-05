declare module '@ioc:I18n/Next' {
  import i18next, { InitOptions } from 'i18next'

  export interface I18nextConfig extends InitOptions {}

  export default i18next
}
