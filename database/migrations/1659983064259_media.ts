import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Media extends BaseSchema {
  protected tableName = 'media'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().defaultTo(this.raw('uuid_generate_v4()'))
      table.integer('company_id').unsigned().references('companies.id')
      table.string('title')
      table.string('source')
      table.string('entity')
      table.string('media_type')
      table.string('mime_type')
      table.string('credit')

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
