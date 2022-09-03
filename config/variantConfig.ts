import { VariantConfig } from '@ioc:Adonis/Addons/VariantConfig'

const variantConfig: VariantConfig = {
  base: {
    name: 'base',
    width: 1260,
  },
  variants: [
    {
      name: 'hero',
      width: 1260,
      height: 1260,
      crop: true,
    },
    {
      name: 'media',
      width: 290,
      height: Math.round((290 / 3) * 2),
      crop: true,
    },
  ],
}

export default variantConfig
