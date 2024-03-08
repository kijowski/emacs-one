import Snippet from '#models/snippet'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { decodeSqid } from './sqid_service.js'

@inject()
export default class SnippetService {
  constructor(protected ctx: HttpContext) {}

  async getAllSnippets(pageNo: number) {
    const paginator = await Snippet.query().preload('tags').preload('user').paginate(pageNo)
    const parsed = paginator.serialize()
    return parsed
  }

  async getSnippet(snippetSqid: string) {
    const snippetId = decodeSqid(snippetSqid)
    const snippet = await Snippet.findOrFail(snippetId)
    await snippet.load('tags')
    await snippet.load('user')
    return snippet.serialize()
  }
}
