import UsersService from '#services/user_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
  constructor(private usersService: UsersService) {}
  async index({ view, request }: HttpContext) {
    const { page } = request.qs()
    const pageNo = Number.parseInt(page ?? '1')
    const paginator = await this.usersService.getAllUsers(pageNo)
    const users = paginator.data
    const pagination = paginator.meta

    return view.render('pages/users/index', { users, pagination })
  }

  async show({ params, view }: HttpContext) {
    const userName = params.id

    const user = await this.usersService.getUser(userName)

    return view.render('pages/users/show', { user })
  }
}
