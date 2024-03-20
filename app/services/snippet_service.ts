import Snippet from '#models/snippet'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { decodeSqid } from './sqid_service.js'
import User from '#models/user'
import Tag from '#models/tag'
import { editOrDeleteSnippet } from '#abilities/main'

@inject()
export default class SnippetService {
  constructor(protected ctx: HttpContext) {}

  async getAllSnippets(pageNo: number) {
    const paginator = await Snippet.query()
      .orderBy('createdAt', 'desc')
      .preload('tags')
      .preload('user')
      .paginate(pageNo)
    const parsed = paginator.serialize()
    return parsed
  }

  async getFavoritesSnippets(pageNo: number) {
    const userId = this.ctx.session.get('current_user_id')
    const paginator = await Snippet.query()
      .whereHas('favoritedBy', (query) => query.where('user_id', '=', userId))
      .orderBy('createdAt', 'desc')
      .preload('tags')
      .preload('user')
      .paginate(pageNo)
    const parsed = paginator.serialize()
    return parsed
  }

  async getSnippet(snippetSqid: string) {
    const userId = this.ctx.session.get('current_user_id')
    const snippetId = decodeSqid(snippetSqid)
    const snippet = await Snippet.findOrFail(snippetId)
    await snippet.load('tags')
    await snippet.load('user')
    await snippet.loadAggregate('favoritedBy', (query) => {
      query.count('*').where('user_id', '=', userId).as('is_favorite')
    })
    return snippet
  }

  async createSnippet(params: { name: string; description?: string; code: string; tags?: string }) {
    const userId = this.ctx.session.get('current_user_id')
    const user = await User.findOrFail(userId)
    const snippet = await user.related('snippets').create(params)
    await snippet.related('tags').detach()
    const dbTags = await Tag.updateOrCreateMany(
      'name',
      params.tags?.split(',').map((x) => ({ name: x.trim() })) ?? []
    )
    await snippet.related('tags').attach(dbTags.map((x) => x.id))
    return snippet
  }

  async updateSnippet(
    snippetSqid: string,
    params: { name: string; description?: string; code: string; tags?: string }
  ) {
    const snippetId = decodeSqid(snippetSqid)
    // const userId = this.ctx.session.get('current_user_id')
    // const user = await User.findOrFail(userId)
    const snippet = await Snippet.findOrFail(snippetId)

    await this.ctx.bouncer.authorize(editOrDeleteSnippet, snippet)

    snippet.name = params.name
    snippet.description = params.description ?? ''
    snippet.code = params.code
    await snippet.related('tags').detach()
    const dbTags = await Tag.updateOrCreateMany(
      'name',
      params.tags?.split(',').map((x) => ({ name: x.trim() })) ?? []
    )
    await snippet.related('tags').attach(dbTags.map((x) => x.id))
    await snippet.save()
    return snippet
  }

  async deleteSnippet(snippetSqid: string) {
    const snippetId = decodeSqid(snippetSqid)
    // const userId = this.ctx.session.get('current_user_id')
    // const user = await User.findOrFail(userId)
    const snippet = await Snippet.findOrFail(snippetId)

    await this.ctx.bouncer.authorize(editOrDeleteSnippet, snippet)

    await snippet.delete()
    // await snippet.save()
    // return snippet
  }

  async toggleFavoriteSnippet(snippetSqid: string) {
    const snippetId = decodeSqid(snippetSqid)
    const userId = this.ctx.session.get('current_user_id')
    const user = await User.findOrFail(userId)
    await user.loadAggregate('favorites', (query) => {
      query.count('*').where('snippet_id', '=', snippetId).as('is_favorite')
    })

    if (user.$extras.is_favorite > 0) {
      user.related('favorites').detach([snippetId])
      return false
    }
    user.related('favorites').attach([snippetId])
    return true
  }
}
