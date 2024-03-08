import Snippet from '#models/snippet'
import SnippetService from '#services/snippet_service'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { type HttpContext } from '@adonisjs/core/http'
import { parse, formatAsHtml } from 'docco-next'

@inject()
export default class SnippetsController {
  constructor(private snippetsService: SnippetService) {}

  async index({ view, request }: HttpContext) {
    const { page } = request.qs()
    const pageNo = Number.parseInt(page ?? '1')
    const paginator = await this.snippetsService.getAllSnippets(pageNo)
    // const paginator = await Snippet.query().preload('tags').preload('user').paginate(pageNo)
    // const parsed = paginator.serialize().data
    const snippets = paginator.data

    return view.render('pages/snippets/index', { snippets })
  }

  async show({ params, view }: HttpContext) {
    const snippetSqid = params.id

    const snippet = await this.snippetsService.getSnippet(snippetSqid)
    // const snippet = await Snippet.find(snippetId)
    // if (snippet == null) {
    //   throw new Exception(`Could not find a snippet with id ${snippetId}`)
    // }
    // await snippet.load('tags')
    // await snippet.load('user')
    // const payload = snippet.serialize()

    return view.render('pages/snippets/show', { snippet })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/snippets/create')
  }

  // async edit({ params, view }: HttpContext) {
  //   const jobId = params.id
  //   const job = await this.jobService.getJob(jobId)

  //   return view.render('pages/jobs/edit', { job })
  // }

  // async update({ params, request, response }: HttpContext) {
  //   const data = await request.validateUsing(createJobValidator)

  //   await this.jobService.updateJob(params.id, data)

  //   const newUrl = router.builder().params({ id: params.id }).make('jobs.show')

  //   response.header('HX-Location', newUrl)
  // }
}
