import { describe, it, expect } from 'bun:test'
import { all, lastX, returnValue, toArray, fromArray } from './generators.ts'

describe('generators', () => {
  describe('all', () => {
    it('should correctly yield falsy values including undefined', async () => {
      async function* gen(): AsyncGenerator<number | undefined | null | false | 0, void> {
        yield 1
        yield undefined
        yield null
        yield false
        yield 0
        yield 2
      }

      const result = await toArray(all([gen()]))
      expect(result).toEqual([1, undefined, null, false, 0, 2])
    })

    it('should run multiple generators concurrently', async () => {
      async function* gen1() {
        yield 1
        yield 3
      }
      async function* gen2() {
        yield 2
        yield 4
      }

      const result = await toArray(all([gen1(), gen2()]))
      // The exact order might be non-deterministic depending on event loop scheduling,
      // but they should all be present. Since they are synchronous yields inside async generators,
      // they will typically interleave based on standard microtask queues, but we just check length
      // and contents for safety.
      expect(result).toHaveLength(4)
      expect(result.sort()).toEqual([1, 2, 3, 4])
    })
  })

  describe('lastX', () => {
    it('should return the last item', async () => {
      async function* gen() {
        yield 1
        yield 2
        yield 3
      }
      expect(await lastX(gen())).toBe(3)
    })

    it('should throw an error if the generator is empty', async () => {
      async function* emptyGen() {
        // empty
      }
      expect(lastX(emptyGen())).rejects.toThrow('No items in generator')
    })
  })

  describe('returnValue', () => {
    it('should return the return value of an async generator', async () => {
      async function* gen(): AsyncGenerator<number, string> {
        yield 1
        yield 2
        return 'done'
      }
      expect(await returnValue(gen())).toBe('done')
    })
  })

  describe('toArray', () => {
    it('should convert an async generator to an array', async () => {
      async function* gen() {
        yield 'a'
        yield 'b'
        yield 'c'
      }
      expect(await toArray(gen())).toEqual(['a', 'b', 'c'])
    })
  })

  describe('fromArray', () => {
    it('should create an async generator from an array', async () => {
      const arr = [1, 2, 3]
      const result = await toArray(fromArray(arr))
      expect(result).toEqual([1, 2, 3])
    })
  })
})
