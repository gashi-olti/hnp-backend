import { ImageConfig } from '@ioc:Adonis/Addons/ImageConfig'

const imageConfig: ImageConfig = {
  entities: {
    company: {
      cover: {
        name: 'cover',
        validation: {
          landscape: true,
        },
      },
      media: {
        name: 'media',
        validation: {
          landscape: true,
        },
      },
    },
  },
}

export default imageConfig
