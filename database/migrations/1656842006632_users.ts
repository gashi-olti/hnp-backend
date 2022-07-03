import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(this.raw('uuid_generate_v4()'))
      table.integer('company_id').references('companies.id').notNullable()
      table.string('email', 255).notNullable()
      table.string('changed_email', 255).nullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.string('verification_token').nullable().defaultTo(null)
      table.boolean('terms_accepted').notNullable().defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.timestamp('verification_created_at', { useTz: true }).nullable().defaultTo(null)
      table.timestamp('verified_at', { useTz: true }).nullable().defaultTo(null)

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
