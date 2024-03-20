import TagsService from '#services/tag_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TagsController {
  constructor(private tagsService: TagsService) {}
  async index({ view, request }: HttpContext) {
    const { page } = request.qs()
    const pageNo = Number.parseInt(page ?? '1')
    const paginator = await this.tagsService.getAllTags(pageNo)
    const tags = paginator.data
    const pagination = paginator.meta

    return view.render('pages/tags/index', { tags, pagination })
  }

  async show({ params, view }: HttpContext) {
    const tagName = params.id

    const tag = await this.tagsService.getTag(tagName)

    return view.render('pages/tags/show', { tag })
  }
}
