import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tag from './tag.js'
import Collection from './collection.js'
import { tokenize } from '#services/highlight_service'
import { IdEntity, encodeSqid } from '#services/sqid_service'

export default class Snippet extends BaseModel {
  serializeExtras() {
    return {
      isFavorite: this.$extras.is_favorite,
    }
  }
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare code: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: number

  @manyToMany(() => Collection)
  declare collections: ManyToMany<typeof Collection>

  @manyToMany(() => User, { pivotTable: 'user_favorites' })
  declare favoritedBy: ManyToMany<typeof User>

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  get tokenized() {
    return tokenize(this.code)
  }

  @computed()
  get sqid() {
    return encodeSqid(this.id, IdEntity.Snippet)
  }

  @computed()
  get excerpt() {
    return tokenize(this.code.split('\n').splice(0, 10).join('\n').trim())
  }

  // @computed()
  // get excerpt() {
  //   return string.truncate(this.body, 50)
  // }
  // return Prism.highlight(content, Prism.languages.lisp, 'lisp')
}
