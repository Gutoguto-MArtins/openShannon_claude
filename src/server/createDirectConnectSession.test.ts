import { describe, expect, test, mock, afterEach } from 'bun:test'

mock.module('zod/v4', () => {
  return {
    z: {
      object: () => ({
        passthrough: () => ({}),
      }),
      string: () => ({}),
      number: () => ({}),
      boolean: () => ({}),
      optional: () => ({}),
    }
  }
})

mock.module('../utils/slowOperations.js', () => {
  return {
    jsonStringify: JSON.stringify
  }
})

describe('createDirectConnectSession', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
  })

  test('throws DirectConnectError when fetch throws an error', async () => {
    const { createDirectConnectSession, DirectConnectError } = await import('./createDirectConnectSession.js')

    global.fetch = mock(() => Promise.reject(new Error('Network failure')))

    await expect(
      createDirectConnectSession({
        serverUrl: 'http://localhost:1234',
        cwd: '/test/cwd',
      })
    ).rejects.toThrow(DirectConnectError)

    await expect(
      createDirectConnectSession({
        serverUrl: 'http://localhost:1234',
        cwd: '/test/cwd',
      })
    ).rejects.toThrow('Failed to connect to server at http://localhost:1234: Network failure')
  })
})
