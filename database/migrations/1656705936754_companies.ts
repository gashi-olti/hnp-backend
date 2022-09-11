import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('stripe_customer_id')
      table.string('stripe_account_id')
      table.string('name').nullable()
      table.string('number').nullable()
      table.string('industry').nullable()
      table.string('size').nullable()
      table.string('founded').nullable()
      table.string('website').nullable()
      table.text('description').nullable()
      table.text('specialties').nullable()
      table.string('city').nullable()
      table.string('postal_code').nullable()
      table.string('country').nullable()
      table.string('phone').nullable()

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
