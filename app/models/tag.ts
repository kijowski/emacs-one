import { DateTime } from 'luxon'
import { BaseModel, column, computed, manyToMany } from '@adonisjs/lucid/orm'
import Snippet from './snippet.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Collection from './collection.js'
import { IdEntity, encodeSqid } from '#services/sqid_service'

export default class Tag extends BaseModel {
  serializeExtras() {
    return {
      counts: {
        snippets: this.$extras.snippets_count,
      },
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @manyToMany(() => Snippet)
  declare snippets: ManyToMany<typeof Snippet>

  @manyToMany(() => Collection)
  declare collections: ManyToMany<typeof Collection>

  @computed()
  get sqid() {
    return encodeSqid(this.id, IdEntity.Tag)
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
