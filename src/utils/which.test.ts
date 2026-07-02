import { expect, test, describe, mock } from 'bun:test'
import { which, whichSync } from './which.js'

describe('which utility', () => {
  test('which returns a valid path for a known command', async () => {
    // Both 'ls' on POSIX and 'cmd' on Windows should generally be found
    const cmd = process.platform === 'win32' ? 'cmd' : 'ls'
    const result = await which(cmd)
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  test('whichSync returns a valid path for a known command', () => {
    const cmd = process.platform === 'win32' ? 'cmd' : 'ls'
    const result = whichSync(cmd)
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  test('which returns null for a non-existent command', async () => {
    const result = await which('this-command-definitely-does-not-exist-123')
    expect(result).toBeNull()
  })

  test('whichSync returns null for a non-existent command', () => {
    const result = whichSync('this-command-definitely-does-not-exist-123')
    expect(result).toBeNull()
  })

  test('prevents command injection via malicious input (async)', async () => {
    // When using `shell: true`, something like `ls; echo injected` might execute the second command
    // With `shell: false` and arguments array, this whole string is treated as the executable name
    // and should simply not be found, returning null.
    const maliciousInput = process.platform === 'win32' ? 'cmd & echo injected' : 'ls; echo injected'
    const result = await which(maliciousInput)
    expect(result).toBeNull()
  })

  test('prevents command injection via malicious input (sync)', () => {
    const maliciousInput = process.platform === 'win32' ? 'cmd & echo injected' : 'ls; echo injected'
    const result = whichSync(maliciousInput)
    expect(result).toBeNull()
  })
})
