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
        fullName: 'Michał Kijowski',
      }
    )

    const tags = await Tag.updateOrCreateMany('name', [
      {
        name: 'One',
      },
      { name: 'Two' },
      { name: 'With space' },
    ])

    const snippets = await user.related('snippets').updateOrCreateMany([
      {
        name: 'First one',
        description: 'Description of first snippet',
        content: '(defun simple ()\n (interactive)\n (message "Hello"))',
      },
      {
        name: 'Second one',
        description: 'Description of second snippet',
        content: '(defun second ()\n (interactive)\n (message "Hello second"))',
      },
    ])

    snippets.forEach((snippet, idx) => {
      snippet.related('tags').attach([tags[idx % 3].id])
    })

    const list = await user.related('lists').updateOrCreate(
      { name: 'First list' },
      {
        name: 'Fist list',
        description: 'My basic list',
      }
    )

    await list.related('snippets').attach([snippets[0].id])
  }
}
