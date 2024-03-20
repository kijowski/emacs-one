import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

@inject()
export default class UserService {
  constructor(protected ctx: HttpContext) {}

  async getAllUsers(pageNo: number) {
    const paginator = await User.query()
      .has('snippets')
      .withAggregate('snippets', (query) => {
        query.count('*').as('snippets_count')
      })
      .orderBy('snippets_count', 'desc')
      .paginate(pageNo)
    const parsed = paginator.serialize()
    return parsed
  }

  async getUser(userName: string) {
    const user = await User.findByOrFail('name', decodeURI(userName))
    await user.load('snippets', (query) => query.preload('tags').preload('user'))
    await user.load('collections')
    return user.serialize()
  }
}
