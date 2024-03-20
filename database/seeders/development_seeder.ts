import Collection from '#models/collection'
import Tag from '#models/tag'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const user = await User.updateOrCreate(
      { email: 'hello@kijowski.dev' },
      {
        email: 'hello@kijowski.dev',
        password: '1234',
        name: 'Michał Kijowski',
      }
    )

    await Tag.updateOrCreateMany('name', [
      {
        id: 1,
        name: 'One',
      },
      { id: 2, name: 'Two' },
      { id: 3, name: 'With space' },
      { id: 4, name: 'Another complex tag' },
    ])

    const snippets = await user.related('snippets').updateOrCreateMany([
      {
        id: 1,
        name: 'First one',
        description: 'Description of first snippet',
        code: '(defun simple ()\n (interactive)\n (message "Hello"))',
      },
      {
        id: 2,
        name: 'Second one',
        description: 'Description of second snippet',
        code: '(defun second ()\n (interactive)\n (message "Hello second"))',
      },

      {
        id: 3,
        name: 'Long one',
        description: 'Description of long snippet',
        code: `(use-package apheleia
  :config
  (add-to-list 'apheleia-formatters '(dprint "dprint" "fmt" "--stdin" filepath))
  (add-to-list 'apheleia-formatters '(dprint-global "dprint" "fmt" "--config" "/Users/michal/.config/dprint/dprint.json" "--stdin" filepath))
  (add-to-list 'apheleia-formatters '(prettier-web "npx" "prettier" "--parser" "html" "--stdin-filepath" filepath))
  (add-to-list 'apheleia-formatters '(eslint "eslint_d" "--fix-to-stdout" "--stdin" "--stdin-filename" filepath))
  (add-to-list 'apheleia-formatters '(sqlformat "sqlformat" "-k" "upper" "-i" "lower" "-a" filepath))
  (add-to-list 'apheleia-formatters '(fantomas "dotnet" "fantomas" inplace))
  (add-to-list 'apheleia-formatters '(rome "npx" "rome" "format" "--stdin-file-path" filepath))
  (add-to-list 'apheleia-formatters '(prettierd "prettierd" filepath))
  (setf (alist-get 'web-mode apheleia-mode-alist) 'prettier-web)
  ;; (setf (alist-get 'typescript-mode apheleia-mode-alist) '(dprint eslint))
  (setf (alist-get 'typescript-mode apheleia-mode-alist) 'dprint)
  (setf (alist-get 'typescript-ts-mode apheleia-mode-alist) 'dprint)
  (setf (alist-get 'typescript-ts-mode apheleia-mode-alist) 'prettierd)
  ;; (setf (alist-get 'typescript-ts-mode apheleia-mode-alist) 'prettier)
  (setf (alist-get 'tsx-ts-mode apheleia-mode-alist) 'dprint)
  (setf (alist-get 'tsx-ts-mode apheleia-mode-alist) 'prettierd)
  ;; (setf (alist-get 'tsx-ts-mode apheleia-mode-alist) 'prettier)
  (setf (alist-get 'js-mode apheleia-mode-alist) 'dprint)
  (setf (alist-get 'bigquery-mode apheleia-mode-alist) 'sqlformat)
  (setf (alist-get 'fsharp-mode apheleia-mode-alist) 'fantomas))`,
      },
      {
        id: 4,
        name: 'Random snippet',
        description: `A couple of days back I made a post here asking how I can replicate my Emacs configuration for Front-end web dev in case I have to use a new computer. Some asked me to share my configuration.

I installed the following packages from MELPA:

Company

Emmet-mode

lsp-mode

web-mode

yasnippet

I added these lines to my .emacs:`,
        code: `(use-package company
  ;; Download company if not found
  :ensure t
  :init
  ;; Turn on company after emacs starts up
  (global-company-mode))

(use-package yasnippet
  :ensure t
  :init
  ;; Turn on yas after emacs starts up
  (yas-global-mode))

(use-package web-mode
  :ensure t
  :mode "\\.html?\\'" 
  :mode "\\.css\\'"
  :mode "\\.phtml\\'"
  :mode "\\.tpl\\.php\\'"
  :mode "\\.[agj]sp\\'"
  :mode "\\.as[cp]x\\'"
  :mode "\\.erb\\'"
  :mode "\\.mustache\\'"
  :mode "\\.djhtml\\'"
  :config
  (setq web-mode-markup-indent-offser 2
        web-mode-css-indent-offset 2
        web-mode-code-indent-offset 2))

(use-package emmet-mode
  :ensure t
  :hook (web-mode . emmet-mode)
  :config
  (setq emmet-indent-after-insert nil
        emmet-indentation 2))

(use-package lsp-mode
  :ensure t
  :hook (( ;; and any other mode you want to hook into emacs
          web-mode) . lsp-deferred))`,
      },
    ])

    await snippets[1].related('tags').sync([1, 2, 3])
    await snippets[2].related('tags').sync([1, 2])
    await snippets[3].related('tags').sync([3])

    const collections = await Collection.updateOrCreateMany('name', [
      {
        id: 1,
        name: 'First collection',
        userId: user.id,
      },
      { id: 2, name: 'Second collection', userId: user.id },
    ])

    await collections[0].related('tags').sync([2, 3])
    await collections[0].related('snippets').sync([1, 2])

    await collections[1].related('snippets').sync([3])

    // snippets.forEach((snippet, idx) => {
    //   snippet.related('tags').attach([tags[idx % 3].id])
    // })

    // const list = await user.related('lists').updateOrCreate(
    //   { name: 'First list' },
    //   {
    //     name: 'Fist list',
    //     description: 'My basic list',
    //   }
    // )

    // await list.related('snippets').attach([snippets[0].id])
  }
}
