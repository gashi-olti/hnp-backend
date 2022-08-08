declare module '@ioc:Adonis/Addons/Hnp' {
  interface JobPosition {
    name: string
  }

  interface DataList {
    id: number
    category: string
    job_position?: JobPosition[]
  }

  interface City {
    name: string
  }

  interface CountriesList {
    country_code: string
    country_name: string
    cities: City[]
  }

  interface HnpConfig {
    jobTypes: DataList[]
    jobPositionTypes: DataList[]
    locations: CountriesList[]
  }
}
