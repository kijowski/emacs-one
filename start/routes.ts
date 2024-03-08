/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import SnippetsController from '#controllers/snippets_controller'
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

router.get('snippets', [SnippetsController, 'index']).as('snippets.index')
router.get('snippets/new', [SnippetsController, 'create']).as('snippets.create')
router.get('snippets/:id', [SnippetsController, 'show']).as('snippets.show')
