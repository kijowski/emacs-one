import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tag from './tag.js'
import SnippetList from './snippet_list.js'
import { tokenize } from '#services/highlight_service'
import { encodeSqid } from '#services/sqid_service'

export default class Snippet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare content: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: number

  @manyToMany(() => SnippetList)
  declare lists: ManyToMany<typeof SnippetList>

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  get tokenized() {
    return tokenize(this.content)
  }

  @computed()
  get sqid() {
    return encodeSqid(this.id)
  }

  // @computed()
  // get excerpt() {
  //   return string.truncate(this.body, 50)
  // }
  // return Prism.highlight(content, Prism.languages.lisp, 'lisp')
}
