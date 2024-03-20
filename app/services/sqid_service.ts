import Sqids from 'sqids'

const sqids = new Sqids({
  blocklist: undefined,
  alphabet: 'KyvpH2OT7atZFrV9hInY51g8fl4xwEeN3jD6ciuPsoWCzXRQ0SMLqdBAUGkbmJ',
  minLength: 4,
})

export const IdEntity = {
  User: 0,
  Snippet: 1,
  Tag: 2,
  Collection: 3,
} as const

type Entity = (typeof IdEntity)[keyof typeof IdEntity]

export function encodeSqid(id: number, kind: Entity) {
  return sqids.encode([kind, id])
}

export function decodeSqid(sid: string) {
  const numbers = sqids.decode(sid) // [1, 2, 3]
  if (numbers.length !== 2) {
    throw new Error('Invalid sid')
  }
  return numbers[1]
}
