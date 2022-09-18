import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().defaultTo(this.raw('uuid_generate_v4()'))
      table.integer('company_id').unsigned().notNullable().references('companies.id')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.integer('type').notNullable()
      table.integer('category').notNullable()
      table.string('location').notNullable()
      table.integer('positions').notNullable()
      table.string('experience').nullable()
      table.string('salary').nullable()
      table.date('ends').notNullable()

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
