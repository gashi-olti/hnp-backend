declare module '@ioc:Adonis/Addons/VariantConfig' {
  interface ImageVariant {
    name: string
    width: number
    height?: number
    crop?: boolean
    quality?: number
    default?: boolean
    grayscale?: boolean
  }

  interface VariantConfig {
    base: ImageVariant
    variants: ImageVariant[]
  }
}
