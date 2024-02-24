import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'snippet_snippet_list'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('snippet_id').unsigned().references('snippets.id').notNullable()
      table.integer('snippet_list_id').unsigned().references('snippet_lists.id').notNullable()
      table.unique(['snippet_id', 'snippet_list_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
