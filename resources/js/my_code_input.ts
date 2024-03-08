// import './vendor/prism.js'
import * as Prism from 'prismjs'
import 'prismjs/components/prism-lisp.js'
// import loadLanguages from 'prismjs/components/index.js'
import '../css/prism-theme.css'

// window.x = loadLanguages
// loadLanguages('lisp')

function update(text: string) {
  let resultElement = document.querySelector('#highlighting-content')!
  // Handle final newlines (see article)
  if (text[text.length - 1] === '\n') {
    text += ' '
  }
  // Update code
  resultElement.innerHTML = text
    .replace(new RegExp('&', 'g'), '&amp;')
    .replace(new RegExp('<', 'g'), '&lt;') /* Global RegExp */
  // Syntax Highlight
  Prism.highlightElement(resultElement)
}

function syncScroll(element: HTMLElement) {
  /* Scroll result to scroll coords of event - sync with textarea */
  let resultElement = document.querySelector('#highlighting')!
  // Get and set x and y
  resultElement.scrollTop = element.scrollTop
  resultElement.scrollLeft = element.scrollLeft
}

function check_tab(element: HTMLTextAreaElement, event: KeyboardEvent) {
  let code = element.value
  if (event.key === 'Tab') {
    /* Tab key pressed */
    event.preventDefault() // stop normal
    let beforeTab = code.slice(0, element.selectionStart) // text before tab
    let afterTab = code.slice(element.selectionEnd, element.value.length) // text after tab
    let cursorPos = element.selectionStart + 1 // where cursor moves after tab - moving forward by 1 char to after tab
    element.value = beforeTab + '\t' + afterTab // add tab char
    // move cursor
    element.selectionStart = cursorPos
    element.selectionEnd = cursorPos
    update(element.value) // Update text to include indent
  }
}

const editor = document.getElementById('editing')! as HTMLTextAreaElement

editor.onscroll = function () {
  syncScroll(this as HTMLTextAreaElement)
}

editor.oninput = function () {
  update((this as HTMLTextAreaElement).value)
  syncScroll(this as HTMLTextAreaElement)
}
editor.onkeydown = function (event) {
  check_tab(this as HTMLTextAreaElement, event)
}

const initialValue = `(defun test-functionisio ()
  (interactive)
    (message "Hey there"))`

editor.value = initialValue
update(initialValue)
