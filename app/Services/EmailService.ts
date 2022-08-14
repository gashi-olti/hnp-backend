import Mail, { MessageComposeCallback, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import View from '@ioc:Adonis/Core/View'
import mjml from 'mjml'
import { htmlToText } from 'html-to-text'
// import Application from '@ioc:Adonis/Core/Application'

import Logger from '@ioc:Adonis/Core/Logger'
import UnprocessableEntityException from 'App/Exceptions/UnprocessableEntityException'
import i18next from '@ioc:I18n/Next'

interface MessageState {
  user?: User | null
  args?: any
}

export default class EmailService {
  private readonly subjectPrefix = ''

  private async send(
    to: string,
    subject: string,
    template: string,
    state: MessageState,
    callback?: MessageComposeCallback,
    force?: boolean
    // attachData: Attachment[] = [] - for future use
  ) {
    if (!force) {
      const user = await User.query().where('email', to).first()
      if (!user) {
        Logger.info('Cannot send email to %s because email was not found.', to)
        return
      }
    }
    const { html: messageHTML, text: messageText } = this.getMessage(template, state)
    console.log('inside send function...')

    try {
      await Mail.use(Env.get('EMAIL_SERVICE')).send((message: MessageContract) => {
        message
          .from(Env.get('EMAIL_FROM_ADDRESS'), Env.get('EMAIL_FROM_NAME'))
          .to(to)
          .bcc('info@hajdenpun.com', 'hajdenpun.com')
          .subject(subject + this.subjectPrefix)
          .html(messageHTML)
          .text(messageText)
        //   .embed(Application.publicPath(`/assets/hnp-logo.png`), 'hnp-logo')
        if (callback) {
          callback(message)
        }
      })
      console.log('inside send/try catch function...')
    } catch (error) {
      Logger.error('Error sendind email: %s', error, error.message)
      throw new UnprocessableEntityException({
        message: i18next.t('common:error sending email'),
      })
    }
  }

  public async sendCompany(
    to: string,
    subject: string,
    template: string,
    state: MessageState,
    callback?: MessageComposeCallback
  ) {
    console.log('insdie sendCompany function...')
    await this.send(to, subject, `emails/company/${template}`, state, callback)
  }

  private getMessage(viewFile: string, state: any): { html: string; text: string } {
    const messageBody = View.renderSync(viewFile, state)
    return {
      html: mjml(messageBody).html,
      text: htmlToText(messageBody),
    }
  }
}
