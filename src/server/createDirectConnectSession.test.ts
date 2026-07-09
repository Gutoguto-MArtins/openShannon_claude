import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test'

import { mock as mockBun } from 'bun:test'
mockBun.module('bun:bundle', () => ({
  feature: () => false,
}))

// Mock any modules that use bun:bundle before importing the main file
mockBun.module('../utils/slowOperations.js', () => ({
  jsonStringify: (val: any) => JSON.stringify(val),
  jsonParse: (val: string) => JSON.parse(val),
}))

const {
  createDirectConnectSession,
  DirectConnectError,
} = await import('./createDirectConnectSession.js')

describe('createDirectConnectSession', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    // Reset fetch mock before each test
    globalThis.fetch = mock()
  })

  afterEach(() => {
    // Restore original fetch
    globalThis.fetch = originalFetch
  })

  it('should successfully create a session without an auth token', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        session_id: 'test-session-id',
        ws_url: 'ws://localhost:8080/ws',
        work_dir: '/test/cwd',
      }),
    }
    ;(globalThis.fetch as any).mockResolvedValue(mockResponse)

    const result = await createDirectConnectSession({
      serverUrl: 'http://localhost:8080',
      cwd: '/test/cwd',
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/sessions',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ cwd: '/test/cwd' }),
      },
    )

    expect(result).toEqual({
      config: {
        serverUrl: 'http://localhost:8080',
        sessionId: 'test-session-id',
        wsUrl: 'ws://localhost:8080/ws',
        authToken: undefined,
      },
      workDir: '/test/cwd',
    })
  })

  it('should successfully create a session with an auth token and dangerouslySkipPermissions', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        session_id: 'test-session-id',
        ws_url: 'ws://localhost:8080/ws',
      }),
    }
    ;(globalThis.fetch as any).mockResolvedValue(mockResponse)

    const result = await createDirectConnectSession({
      serverUrl: 'http://localhost:8080',
      authToken: 'secret-token',
      cwd: '/test/cwd',
      dangerouslySkipPermissions: true,
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/sessions',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer secret-token',
        },
        body: JSON.stringify({
          cwd: '/test/cwd',
          dangerously_skip_permissions: true,
        }),
      },
    )

    expect(result).toEqual({
      config: {
        serverUrl: 'http://localhost:8080',
        sessionId: 'test-session-id',
        wsUrl: 'ws://localhost:8080/ws',
        authToken: 'secret-token',
      },
      workDir: undefined,
    })
  })

  it('should throw DirectConnectError on network error (fetch throws)', async () => {
    ;(globalThis.fetch as any).mockRejectedValue(new Error('Network failure'))

    await expect(
      createDirectConnectSession({
        serverUrl: 'http://localhost:8080',
        cwd: '/test/cwd',
      }),
    ).rejects.toThrow(DirectConnectError)

    await expect(
      createDirectConnectSession({
        serverUrl: 'http://localhost:8080',
        cwd: '/test/cwd',
      }),
    ).rejects.toThrow(
      'Failed to connect to server at http://localhost:8080: Network failure',
    )
  })

  it('should throw DirectConnectError on non-ok HTTP status', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }
    ;(globalThis.fetch as any).mockResolvedValue(mockResponse)

    await expect(
      createDirectConnectSession({
        serverUrl: 'http://localhost:8080',
        cwd: '/test/cwd',
      }),
    ).rejects.toThrow(DirectConnectError)

    await expect(
      createDirectConnectSession({
        serverUrl: 'http://localhost:8080',
        cwd: '/test/cwd',
      }),
    ).rejects.toThrow(
      'Failed to create session: 500 Internal Server Error',
    )
  })

  it('should throw DirectConnectError on invalid JSON schema response', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        // Missing required fields session_id and ws_url
        work_dir: '/test/cwd',
      }),
    }
    ;(globalThis.fetch as any).mockResolvedValue(mockResponse)

    await expect(
      createDirectConnectSession({
        serverUrl: 'http://localhost:8080',
        cwd: '/test/cwd',
      }),
    ).rejects.toThrow(DirectConnectError)

    await expect(
      createDirectConnectSession({
        serverUrl: 'http://localhost:8080',
        cwd: '/test/cwd',
      }),
    ).rejects.toThrow(/Invalid session response:/)
  })
})
