declare module '@ioc:Adonis/Addons/Hnp' {
  interface DataList {
    id: number
    name: string
    category?: string
    country?: string
  }

  interface HnpConfig {
    jobTypes: DataList[]
    jobPositionTypes: DataList[]
    cities: DataList[]
  }
}
