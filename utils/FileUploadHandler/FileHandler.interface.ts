import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { ResponseStream } from '@ioc:Adonis/Core/Response'

import { PassThrough } from 'stream'
export declare class AbstractFileUploadHandler {
  public uploadMedia(file: MultipartFileContract): Promise<string>

  public updateOrDeleteMedia(
    newFile: string | undefined,
    oldFile: string | null | undefined
  ): Promise<string | null>

  public moveMedia(file: string): Promise<string>

  public deleteMedia(file: string): Promise<void>

  public deleteCache(file: string): Promise<void>

  public uploadFromStream(
    file?: string,
    contentType?: string | false
  ): { writeStream: PassThrough; promise: Promise<string> }

  public getMimeType(file: string): Promise<string>

  public readFile(file: string): Promise<{
    file: string | ResponseStream
    data?: { contentType?: string; contentLength?: number }
  }>

  public readFileAsBuffer(file: string): Promise<Buffer>

  public fileExists(file: string): Promise<boolean>
}
