import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'snippet_list_tag'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('snippet_list_id').unsigned().references('snippet_lists.id').notNullable()
      table.integer('tag_id').unsigned().references('tags.id').notNullable()
      table.unique(['snippet_list_id', 'tag_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
