/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const SnippetsController = () => import('#controllers/snippets_controller')
const AuthController = () => import('#controllers/auth_controller')
const TagsController = () => import('#controllers/tags_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', [SnippetsController, 'index']).as('home')

router.get('login', [AuthController, 'show']).use(middleware.guest()).as('login')
router.post('login', [AuthController, 'login']).use(middleware.guest())
router.get('register', [AuthController, 'show']).use(middleware.guest()).as('register')
router.post('register', [AuthController, 'register']).use(middleware.guest())
router.get('logout', [AuthController, 'logout']).use(middleware.auth()).as('logout')

router.get('s', [SnippetsController, 'index']).as('snippets.index')
router.get('s/new', [SnippetsController, 'create']).as('snippets.create')
router.get('s/:id', [SnippetsController, 'show']).as('snippets.show')
router.get('s/:id/edit', [SnippetsController, 'edit']).as('snippets.edit').use(middleware.auth())
router.post('s', [SnippetsController, 'store']).as('snippets.store').use(middleware.auth())
router.post('s/:id', [SnippetsController, 'update']).as('snippets.update').use(middleware.auth())
router.delete('s/:id', [SnippetsController, 'delete']).as('snippets.delete').use(middleware.auth())
router
  .post('s/:id/favorite', [SnippetsController, 'favorite'])
  .as('snippets.favorite')
  .use(middleware.auth())
router.get('f', [SnippetsController, 'favorites']).as('snippets.favorites')

router.get('t', [TagsController, 'index']).as('tags.index')
router.get('t/:id', [TagsController, 'show']).as('tags.show')

router.get('u', [UsersController, 'index']).as('users.index')
router.get('u/:id', [UsersController, 'show']).as('users.show')
