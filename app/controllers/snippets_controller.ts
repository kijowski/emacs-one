import { editOrDeleteSnippet } from '#abilities/main'
import SnippetService from '#services/snippet_service'
import { createSnippetValidator } from '#validators/snippet'
import { inject } from '@adonisjs/core'
import { type HttpContext } from '@adonisjs/core/http'

@inject()
export default class SnippetsController {
  constructor(private snippetsService: SnippetService) {}

  async index({ view, request }: HttpContext) {
    const { page } = request.qs()
    const pageNo = Number.parseInt(page ?? '1')
    const paginator = await this.snippetsService.getAllSnippets(pageNo)
    const snippets = paginator.data
    const pagination = paginator.meta

    return view.render('pages/snippets/index', { snippets, pagination, title: 'All snippets' })
  }

  async favorites({ request, view }: HttpContext) {
    const { page } = request.qs()
    const pageNo = Number.parseInt(page ?? '1')
    const paginator = await this.snippetsService.getFavoritesSnippets(pageNo)
    const snippets = paginator.data
    const pagination = paginator.meta
    return view.render('pages/snippets/index', { snippets, pagination, title: 'Favorites' })
  }

  async show({ params, view }: HttpContext) {
    const snippetSqid = params.id

    const snippet = await this.snippetsService.getSnippet(snippetSqid)

    return view.render('pages/snippets/show', { snippet: snippet.serialize() })
  }

  async create({ request, view }: HttpContext) {
    const { base } = request.qs()
    let snippet = {}
    if (base) {
      snippet = await this.snippetsService.getSnippet(base)
    }
    return view.render('pages/snippets/create', { base: snippet })
  }

  async store({ request, response }: HttpContext) {
    const { name, description, code, tags } = await request.validateUsing(createSnippetValidator)

    const snippet = await this.snippetsService.createSnippet({
      name,
      description,
      code,
      tags,
    })

    return response.redirect().toRoute('snippets.show', { id: snippet.sqid })
  }

  async edit({ params, view, bouncer }: HttpContext) {
    const snippetSqid = params.id
    const snippet = await this.snippetsService.getSnippet(snippetSqid)

    await bouncer.authorize(editOrDeleteSnippet, snippet)

    return view.render('pages/snippets/edit', { snippet: snippet.serialize() })
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(createSnippetValidator)
    const snippet = await this.snippetsService.updateSnippet(params.id, data)
    // const newUrl = router.builder().params({ id: params.id }).make('jobs.show')
    // response.header('HX-Location', newUrl)
    return response.redirect().toRoute('snippets.show', { id: snippet.sqid })
  }

  async delete({ params, response }: HttpContext) {
    await this.snippetsService.deleteSnippet(params.id)
    return response.redirect().toRoute('snippets.index')
  }

  async favorite({ params }: HttpContext) {
    const isFavorite = await this.snippetsService.toggleFavoriteSnippet(params.id)
    // return view.renderRaw(
    //   isFavorite ? "@svg('clarity:favorite-solid')" : "@svg('clarity:favorite-line')"
    // )
    return isFavorite ? 'Remove from favorites' : 'Add to favorites'
  }
}
