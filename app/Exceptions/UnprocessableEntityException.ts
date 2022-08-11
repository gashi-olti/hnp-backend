import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseInterface } from './Handler'

export default class UnprocessableEntityException extends Exception {
  private bodyErrors: any[] = []

  private bodyData: any = {}

  private bodyMessage: string | null = null

  constructor({
    message = null,
    errors = [],
    data = {},
  }: {
    message?: string | null
    errors?: { field: string; message: string }[]
    data?: any
  }) {
    super('Unprocessable Entity', 422)
    this.bodyErrors = errors
    this.bodyData = data
    if (message !== null && this.message !== message) {
      this.bodyMessage = message
    }
  }

  public async handle(error: this, { response }: HttpContextContract) {
    const responseBody: ResponseInterface = {
      message: this.bodyMessage,
      errors: this.bodyErrors,
      data: this.bodyData,
    }
    response.status(error.status).send(responseBody)
  }
}
