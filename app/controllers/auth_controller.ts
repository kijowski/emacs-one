import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async show({ route, request, view }: HttpContext) {
    const isLogin = route?.name === 'login'
    const referer = request.header('referer')

    return view.render('pages/login', { action: isLogin ? 'login' : 'register', referer })
  }

  async login({ request, auth, response, session }: HttpContext) {
    const { name, password, forward } = request.only(['name', 'password', 'forward'])

    const user = await User.verifyCredentials(name, password)

    await auth.use('web').login(user)

    session.put('current_user_id', user.id)

    response.redirect(forward ?? '/')
  }

  async register({ request, auth, response, session }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    const user = await User.create({ name, email, password })

    await auth.use('web').login(user)

    session.put('current_user_id', user.id)

    response.redirect('/')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
