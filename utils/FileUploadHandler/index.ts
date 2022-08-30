import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Env from '@ioc:Adonis/Core/Env'
import { ResponseStream } from '@ioc:Adonis/Core/Response'
import { PassThrough } from 'stream'
import { AbstractFileUploadHandler } from './FileHandler.interface'
import LocalFileHandler from './LocalFileHandler'

export default class FileHandler implements AbstractFileUploadHandler {
  private handler: AbstractFileUploadHandler

  public type: 'local'

  constructor() {
    if (Env.get('NODE_ENV') !== 'production') {
      this.handler = new LocalFileHandler()
      this.type = 'local'
    }
  }

  public async uploadMedia(file: MultipartFileContract) {
    return this.handler.uploadMedia(file)
  }

  public uploadFromStream(
    file?: string | undefined,
    contentType?: string | false | undefined
  ): { writeStream: PassThrough; promise: Promise<string> } {
    return this.handler.uploadFromStream(file, contentType)
  }

  public async getMimeType(file: string) {
    return this.handler.getMimeType(file)
  }

  public async moveMedia(file: string) {
    return this.moveMedia(file)
  }

  public async deleteMedia(file: string) {
    return this.handler.deleteMedia(file)
  }

  public async deleteCache(file: string) {
    return this.handler.deleteCache(file)
  }

  public async updateOrDeleteMedia(
    newFile: string | undefined,
    oldFile: string | null | undefined
  ) {
    return this.updateOrDeleteMedia(newFile, oldFile)
  }

  public async readFile(file: string): Promise<{
    file: string | ResponseStream
    data?: { contentType?: string | undefined; contentLength?: number | undefined } | undefined
  }> {
    return this.handler.readFile(file)
  }

  public async readFileAsBuffer(file: string) {
    return this.readFileAsBuffer(file)
  }

  public async fileExists(file: string) {
    return this.handler.fileExists(file)
  }
}
