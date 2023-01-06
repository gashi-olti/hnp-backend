declare module '@ioc:Adonis/Core/Validator' {
  export interface Rules {
    accepted(): Rule
    plaintextMax(maxLength: number): Rule
    numericEnumIncludes(acceptedValues: any[]): Rule
    dateMax(): Rule
  }
}
