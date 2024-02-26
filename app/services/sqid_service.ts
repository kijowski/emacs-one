import Sqids from 'sqids'

const sqids = new Sqids({
  blocklist: undefined,
  alphabet: 'KyvpH2OT7atZFrV9hInY51g8fl4xwEeN3jD6ciuPsoWCzXRQ0SMLqdBAUGkbmJ',
  minLength: 4,
})

export function encodeId(id: number) {
  return sqids.encode([id])
}

export function decodeSid(sid: string) {
  const numbers = sqids.decode(sid) // [1, 2, 3]
  if (numbers.length !== 1) {
    throw new Error('Invalid sid')
  }
  return numbers[0]
}
