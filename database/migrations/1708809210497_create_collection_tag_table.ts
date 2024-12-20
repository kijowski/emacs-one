import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'collection_tag'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('collection_id')
        .unsigned()
        .references('collections.id')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('tag_id').unsigned().references('tags.id').notNullable().onDelete('CASCADE')
      table.unique(['collection_id', 'tag_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
