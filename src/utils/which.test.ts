import { describe, expect, it } from 'bun:test'
import { which, whichSync } from './which.ts'

describe('which', () => {
  it('should find node executable asynchronously', async () => {
    const result = await which('node')
    expect(result).not.toBeNull()
    expect(typeof result).toBe('string')
  })

  it('should prevent command injection asynchronously', async () => {
    const result = await which('node; echo PWNED')
    expect(result).toBeNull()
  })

  it('should find node executable synchronously', () => {
    const result = whichSync('node')
    expect(result).not.toBeNull()
    expect(typeof result).toBe('string')
  })

  it('should prevent command injection synchronously', () => {
    const result = whichSync('node; echo PWNED')
    expect(result).toBeNull()
  })
})
