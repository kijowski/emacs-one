import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Snippet from './snippet.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import SnippetList from './snippet_list.js'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @manyToMany(() => Snippet)
  declare snippets: ManyToMany<typeof Snippet>

  @manyToMany(() => SnippetList)
  declare lists: ManyToMany<typeof SnippetList>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
