import vine from '@vinejs/vine'

export const createSnippetValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    description: vine.string().trim().escape().optional(),
    code: vine.string().trim(),
    tags: vine.string().trim().optional(),
  })
)
