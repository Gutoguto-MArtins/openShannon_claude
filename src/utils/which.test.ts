import { describe, expect, it } from 'bun:test'
import { which, whichSync } from './which.js'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

describe('which', () => {
  it('should find node executable asynchronously', async () => {
    const nodePath = await which('node')
    expect(nodePath).not.toBeNull()
    expect(typeof nodePath).toBe('string')
  })

  it('should find node executable synchronously', () => {
    const nodePath = whichSync('node')
    expect(nodePath).not.toBeNull()
    expect(typeof nodePath).toBe('string')
  })

  it('should return null for non-existent command', async () => {
    const result = await which('some-non-existent-command-that-surely-doesnt-exist')
    expect(result).toBeNull()
  })

  it('should return null for non-existent command synchronously', () => {
    const result = whichSync('some-non-existent-command-that-surely-doesnt-exist')
    expect(result).toBeNull()
  })

  it('should not allow command injection asynchronously', async () => {
    const tmpDir = os.tmpdir()
    const pwnedFile = path.join(tmpDir, `pwned-async-${Date.now()}`)

    // Attempt injection using multiple operators
    const maliciousPayload = process.platform === 'win32'
      ? `node & echo "pwned" > "${pwnedFile}"`
      : `node && echo "pwned" > "${pwnedFile}"`

    const result = await which(maliciousPayload)

    // Expect null because it's looking for an executable named literally "node && echo..."
    expect(result).toBeNull()

    // Ensure the side effect didn't happen
    const fileExists = fs.existsSync(pwnedFile)
    expect(fileExists).toBe(false)

    if (fileExists) {
      fs.unlinkSync(pwnedFile)
    }
  })

  it('should not allow command injection synchronously', () => {
    const tmpDir = os.tmpdir()
    const pwnedFile = path.join(tmpDir, `pwned-sync-${Date.now()}`)

    // Attempt injection using multiple operators
    const maliciousPayload = process.platform === 'win32'
      ? `node & echo "pwned" > "${pwnedFile}"`
      : `node && echo "pwned" > "${pwnedFile}"`

    const result = whichSync(maliciousPayload)

    // Expect null because it's looking for an executable named literally "node && echo..."
    expect(result).toBeNull()

    // Ensure the side effect didn't happen
    const fileExists = fs.existsSync(pwnedFile)
    expect(fileExists).toBe(false)

    if (fileExists) {
      fs.unlinkSync(pwnedFile)
    }
  })
})
