import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'

@inject()
export default class TagService {
  constructor(protected ctx: HttpContext) {}

  async getAllTags(pageNo: number) {
    const paginator = await Tag.query()
      .has('snippets')
      .withAggregate('snippets', (query) => {
        query.count('*').as('snippets_count')
      })
      .orderBy('snippets_count', 'desc')
      .paginate(pageNo)
    const parsed = paginator.serialize()
    return parsed
  }

  async getTag(tagName: string) {
    const tag = await Tag.findByOrFail('name', decodeURI(tagName))
    await tag.load('snippets', (query) => query.preload('user').preload('tags'))
    await tag.load('collections')
    return tag.serialize()
  }
}
