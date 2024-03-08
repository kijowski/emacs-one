import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'

loadLanguages('lisp')

export function tokenize(content: string) {
  return Prism.highlight(content, Prism.languages.lisp, 'lisp')
}
