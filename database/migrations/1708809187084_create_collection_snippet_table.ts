import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'collection_snippet'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('snippet_id')
        .unsigned()
        .references('snippets.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .integer('collection_id')
        .unsigned()
        .references('collections.id')
        .notNullable()
        .onDelete('CASCADE')
      table.unique(['snippet_id', 'collection_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
