import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Extensions extends BaseSchema {
  public async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "pg_trgm"')
  }

  public async down() {
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
    this.schema.raw('DROP EXTENSION IF EXISTS "pg_trgm"')
  }
}
