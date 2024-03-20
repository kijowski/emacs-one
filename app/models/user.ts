import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Snippet from './snippet.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Collection from './collection.js'
import { IdEntity, encodeSqid } from '#services/sqid_service'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['name'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
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

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare verified: boolean

  @hasMany(() => Snippet)
  declare snippets: HasMany<typeof Snippet>

  @manyToMany(() => Snippet, { pivotTable: 'user_favorites' })
  declare favorites: ManyToMany<typeof Snippet>

  @hasMany(() => Collection)
  declare collections: HasMany<typeof Collection>

  @computed()
  get sqid() {
    return encodeSqid(this.id, IdEntity.User)
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
