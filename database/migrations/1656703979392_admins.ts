import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Admins extends BaseSchema {
  protected tableName = 'admins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      /**
       * Email is unique constraint
       */
      table.unique(['email'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
