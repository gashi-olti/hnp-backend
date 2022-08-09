declare module '@ioc:Adonis/Addons/ImageConfig' {
  interface ImageVariant {
    name: string
    width: number
    height?: number
    crop?: boolean
    quality?: number
    deafult: number
    grayscale: boolean
  }

  interface ImageValidation {
    landscape?: boolean
    portrait?: boolean
    maxWidth?: number
    maxHeight?: number
    minWidth?: number
    minHeight?: number
  }

  interface ImageType {
    variants?: ImageVariant[]
    validation: ImageValidation
    name: string
  }

  interface ImageEntity {
    [type: string]: ImageType
  }

  interface ImageEntities {
    [entity: string]: ImageEntity
  }

  interface ImageConfig {
    entities: ImageEntities
  }
}
