/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/
import fs from 'fs'
import { createServer } from 'http'
import { createServer as createHttpsServer } from 'https'

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'

let httpsOptions: { key?: string | Buffer; cert?: string | Buffer } | undefined
try {
  httpsOptions = {
    key: fs.readFileSync('./.keys/local.key'),
    cert: fs.readFileSync('./.keys/local.crt'),
  }
} catch (error) {
  if (process.env.ENABLE_HTTPS === 'true') {
    console.error(' ')
    console.error('❌ Can not find access keys.')
    console.error('❌ Therefor can not enable https.')
    console.error(' ')
  }
}

sourceMapSupport.install({ handleUncaughtExceptions: false })

new Ignitor(__dirname).httpServer().start((handle: any) => {
  if (process.env.ENABLE_HTTPS === 'true' && httpsOptions) {
    console.info(' ')
    console.info('🔐 HTTPS ENABLED 🔓')
    console.info(' ')
    return createHttpsServer(httpsOptions, handle)
  }
  return createServer(handle)
})
