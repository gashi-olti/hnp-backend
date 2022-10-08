import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MediaCompanies extends BaseSchema {
  protected tableName = 'media_companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('media_id').unsigned().references('media.id')
      table.integer('company_id').unsigned().references('companies.id')
      table.string('type')
      table.unique(['media_id', 'company_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
