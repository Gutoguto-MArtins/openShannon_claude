import { test, expect, describe } from 'bun:test'
import { which, whichSync } from './which.js'

describe('which', () => {
  test('returns path for valid command async', async () => {
    const path = await which('ls')
    expect(path).toBeTruthy()
    expect(path).toContain('ls')
  })

  test('returns null for invalid command async', async () => {
    const path = await which('this-command-does-not-exist')
    expect(path).toBeNull()
  })

  test('prevents command injection async', async () => {
    const path = await which('ls; touch /tmp/pwned-async')
    expect(path).toBeNull()
  })

  test('returns path for valid command sync', () => {
    const path = whichSync('ls')
    expect(path).toBeTruthy()
    expect(path).toContain('ls')
  })

  test('returns null for invalid command sync', () => {
    const path = whichSync('this-command-does-not-exist')
    expect(path).toBeNull()
  })

  test('prevents command injection sync', () => {
    const path = whichSync('ls; touch /tmp/pwned-sync')
    expect(path).toBeNull()
  })
})
