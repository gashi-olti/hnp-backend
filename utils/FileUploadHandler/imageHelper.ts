import sharp from 'sharp'

import { Exception } from '@adonisjs/core/build/standalone'
import { ImageValidation, ImageVariant } from '@ioc:Adonis/Addons/ImageConfig'
import i18next from '@ioc:I18n/Next'

export async function validateImage(image: sharp.Sharp, validation?: ImageValidation) {
  const metadata = await image.metadata()

  if (!validation) return
  if (
    validation?.portrait &&
    metadata.width &&
    metadata.height &&
    metadata.height < metadata.width
  ) {
    throw new Exception(i18next.t('validation:image not portrait'), 422)
  }
  if (
    validation?.landscape &&
    metadata.width &&
    metadata.height &&
    metadata.height > metadata.width
  ) {
    throw new Exception(i18next.t('validation:image not landscape'), 422)
  }
  if (validation?.minWidth && metadata.width && metadata.width < validation?.minWidth) {
    throw new Exception(i18next.t('validation:image too small'), 422)
  }
  if (validation?.maxWidth && metadata.width && metadata.width > validation?.maxWidth) {
    throw new Exception(i18next.t('validation:image too large'), 422)
  }
  if (validation?.minHeight && metadata.height && metadata.height < validation?.minHeight) {
    throw new Exception(i18next.t('validation:image too small'), 422)
  }
  if (validation?.maxHeight && metadata.height && metadata.height > validation?.maxHeight) {
    throw new Exception(i18next.t('validation:image too large'), 422)
  }
}

async function processImage(
  image: sharp.Sharp,
  fileName: string,
  variant: ImageVariant,
  callback: (buffer: Buffer, name: string) => void
) {
  let transform = image
    .jpeg({ progressive: true, quality: variant.quality ?? 70, force: false })
    .png({ progressive: true, quality: variant.quality ?? 70, force: false })
    .webp({ quality: variant.quality ?? 70, force: false })

  if (variant.width && variant.height) {
    transform = transform.resize(variant.width, variant.height, {
      fit: !variant.crop ? 'inside' : 'cover',
    })
  }
  if (variant.width && !variant.height) {
    transform = transform.resize(variant.width)
  }

  return variant.grayscale
    ? transform
        .grayscale()
        .toBuffer()
        .then((buffer) => callback(buffer, fileName))
    : transform.toBuffer().then((buffer) => callback(buffer, fileName))
}

export async function createVariant(
  image: sharp.Sharp,
  fileName: string,
  variant: ImageVariant,
  callback: (buffer: Buffer, name: string) => void
) {
  const name = `${variant.name}-${fileName}`
  await processImage(image, name, variant, callback)
}
