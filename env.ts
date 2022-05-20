/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  FRONTEND_URL: Env.schema.string({
    format: 'url',
    tld: process.env.EMAIL_SERVICE === 'production' ? true : false,
  }),
  BACKEND_URL: Env.schema.string({
    format: 'url',
  }),
  MEDIA_IMAGE_URL: Env.schema.string({
    format: 'url',
  }),
  MEDIA_FILE_URL: Env.schema.string({
    format: 'url',
  }),
  MEDIA_BUCKET_URL: Env.schema.string({
    format: 'url',
  }),
  TZ: Env.schema.string(),
  PG_HOST: Env.schema.string(),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),
  STRIPE_SECRET_KEY: Env.schema.string(),
  STRIPE_PUBLIC_KEY: Env.schema.string(),
  STRIPE_API_VERSION: Env.schema.string(),
  STRIPE_CONNECT_WEBHOOK_SECRET: Env.schema.string(),
  STRIPE_DIRECT_WEBHOOK_SECRET: Env.schema.string(),
  STRIPE_SUBSCRIPTION_DEFAULT_TAX_ID: Env.schema.string(),
  I18N_DEBUG: Env.schema.boolean.optional(),
  DB_DEBUG: Env.schema.boolean.optional(),
  EMAIL_SERVICE: Env.schema.enum(['ses', 'smtp', 'mailgun'] as const),
  EMAIL_FROM_ADDRESS: Env.schema.string({ format: 'email' }),
  EMAIL_FROM_NAME: Env.schema.string(),
  SMTP_HOST: Env.schema.string.optional({ format: 'host' }),
  SMTP_PORT: Env.schema.number.optional(),
  SMTP_USERNAME: Env.schema.string.optional(),
  SMTP_PASSWORD: Env.schema.string.optional(),
  SES_ACCESS_KEY: Env.schema.string.optional(),
  SES_ACCESS_SECRET: Env.schema.string.optional(),
  SES_REGION: Env.schema.string.optional(),
  ARN_TOPIC_BOUNCE: Env.schema.string.optional(),
  ARN_TOPIC_COMPLAINT: Env.schema.string.optional(),
  MAILGUN_API_KEY: Env.schema.string.optional(),
  MAILGUN_DOMAIN: Env.schema.string.optional({ format: 'host' }),
})
