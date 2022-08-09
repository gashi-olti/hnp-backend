/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import i18next from '@ioc:I18n/Next'

export interface ResponseInterface {
  message: string | null
  errors: { field: string; message: string }[]
  data: any
}

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.code === 'E_ROW_NOT_FOUND' || error.code === '22P02') {
      error.message = i18next.t('common:not found')
    }

    if (error.code === 'E_INVALID_AUTH_PASSWORD') {
      error.messages = {
        errors: [{ message: i18next.t('validation:invalid credentials') }],
      }

      return ctx.response.status(400).send(error.messages)
    }
    return super.handle(error, ctx)
  }
}
