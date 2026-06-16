import { describe, expect, it } from 'bun:test'
import { which, whichSync } from './which.js'

describe('which', () => {
  it('should find node executable async', async () => {
    const nodePath = await which('node')
    expect(nodePath).not.toBeNull()
    expect(typeof nodePath).toBe('string')
    expect(nodePath!.endsWith('node')).toBe(true)
  })

  it('should prevent command injection async', async () => {
    const result = await which('node; echo PWNED')
    expect(result).toBeNull()
  })
})

describe('whichSync', () => {
  it('should find node executable sync', () => {
    const nodePath = whichSync('node')
    expect(nodePath).not.toBeNull()
    expect(typeof nodePath).toBe('string')
    expect(nodePath!.endsWith('node')).toBe(true)
  })

  it('should prevent command injection sync', () => {
    const result = whichSync('node; echo PWNED')
    expect(result).toBeNull()
  })
})
