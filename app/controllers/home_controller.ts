import SnippetService from '#services/snippet_service'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class HomeController {
  constructor(private snippetsService: SnippetService) {}

  async index({ view }: HttpContext) {
    const paginator = await this.snippetsService.getAllSnippets(1)
    const snippets = paginator.data

    return view.render('pages/home', { snippets, title: 'Latest snippets' })
  }
}
