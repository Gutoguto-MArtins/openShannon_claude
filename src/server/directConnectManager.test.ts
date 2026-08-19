import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test'

mock.module('bun:bundle', () => ({
  feature: () => false
}))

mock.module('bundle', () => ({
  feature: () => false
}))

const { DirectConnectSessionManager } = await import('./directConnectManager.js')

describe('DirectConnectSessionManager', () => {
  let originalWebSocket: typeof WebSocket
  let mockWebSocket: any
  let listeners: Record<string, ((event: any) => void)[]>

  beforeEach(() => {
    originalWebSocket = globalThis.WebSocket
    listeners = {}
    mockWebSocket = {
      addEventListener: mock((event: string, callback: any) => {
        if (!listeners[event]) {
          listeners[event] = []
        }
        listeners[event].push(callback)
      }),
      send: mock(),
      close: mock(),
      // Use 1 to match WebSocket.OPEN
      readyState: 1
    }
    // @ts-ignore
    globalThis.WebSocket = mock((url, options) => {
      return mockWebSocket
    })

    // We also need to define WebSocket globally with OPEN
    // @ts-ignore
    globalThis.WebSocket.OPEN = 1
  })

  afterEach(() => {
    globalThis.WebSocket = originalWebSocket
  })

  const triggerEvent = (event: string, data?: any) => {
    const eventListeners = listeners[event] || []
    for (const listener of eventListeners) {
      listener({ data })
    }
  }

  describe('connect', () => {
    it('connects with auth token header', () => {
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
        authToken: 'token123'
      }, {
        onMessage: () => {},
        onPermissionRequest: () => {},
      })

      manager.connect()

      expect(globalThis.WebSocket).toHaveBeenCalledWith('ws://localhost', {
        headers: { authorization: 'Bearer token123' }
      } as any)
    })

    it('connects without auth token header', () => {
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, {
        onMessage: () => {},
        onPermissionRequest: () => {},
      })

      manager.connect()

      expect(globalThis.WebSocket).toHaveBeenCalledWith('ws://localhost', {
        headers: {}
      } as any)
    })

    it('triggers onConnected when open', () => {
      const onConnected = mock()
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, {
        onMessage: () => {},
        onPermissionRequest: () => {},
        onConnected
      })
      manager.connect()
      triggerEvent('open')
      expect(onConnected).toHaveBeenCalled()
    })

    it('triggers onDisconnected when close', () => {
      const onDisconnected = mock()
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, {
        onMessage: () => {},
        onPermissionRequest: () => {},
        onDisconnected
      })
      manager.connect()
      triggerEvent('close')
      expect(onDisconnected).toHaveBeenCalled()
    })

    it('triggers onError when error', () => {
      const onError = mock()
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, {
        onMessage: () => {},
        onPermissionRequest: () => {},
        onError
      })
      manager.connect()
      triggerEvent('error')
      expect(onError).toHaveBeenCalled()
    })
  })

  describe('message handling', () => {
    let onMessage: ReturnType<typeof mock>
    let onPermissionRequest: ReturnType<typeof mock>
    let manager: any

    beforeEach(() => {
      onMessage = mock()
      onPermissionRequest = mock()
      manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, {
        onMessage,
        onPermissionRequest,
      })
      manager.connect()
    })

    it('ignores non-JSON messages', () => {
      triggerEvent('message', 'invalid-json')
      expect(onMessage).not.toHaveBeenCalled()
      expect(onPermissionRequest).not.toHaveBeenCalled()
    })

    it('ignores non-StdoutMessage messages', () => {
      triggerEvent('message', JSON.stringify({ notType: 'foo' }))
      expect(onMessage).not.toHaveBeenCalled()
    })

    it('ignores when type is missing', () => {
      triggerEvent('message', JSON.stringify({}))
      expect(onMessage).not.toHaveBeenCalled()
    })

    it('calls onPermissionRequest for control_request subtype can_use_tool', () => {
      const request = {
        type: 'control_request',
        request_id: 'req-1',
        request: { subtype: 'can_use_tool' }
      }
      triggerEvent('message', JSON.stringify(request))
      expect(onPermissionRequest).toHaveBeenCalledWith(request.request, 'req-1')
    })

    it('replies with error for unknown control_request subtypes', () => {
      const request = {
        type: 'control_request',
        request_id: 'req-1',
        request: { subtype: 'unknown_stuff' }
      }
      triggerEvent('message', JSON.stringify(request))
      expect(onPermissionRequest).not.toHaveBeenCalled()
      expect(mockWebSocket.send).toHaveBeenCalled()
      const callArgs = mockWebSocket.send.mock.calls[0][0]
      const sentData = JSON.parse(callArgs)
      expect(sentData.type).toBe('control_response')
      expect(sentData.response.subtype).toBe('error')
      expect(sentData.response.request_id).toBe('req-1')
      expect(sentData.response.error).toContain('Unsupported control request subtype')
    })

    it('forwards generic SDK messages to onMessage', () => {
      const message = { type: 'assistant', message: 'hello' }
      triggerEvent('message', JSON.stringify(message))
      expect(onMessage).toHaveBeenCalledWith(message)
    })

    it('filters out keep_alive, control_response, control_cancel_request, streamlined_text, and streamlined_tool_use_summary', () => {
      const ignoreTypes = ['keep_alive', 'control_response', 'control_cancel_request', 'streamlined_text', 'streamlined_tool_use_summary']
      for (const t of ignoreTypes) {
        triggerEvent('message', JSON.stringify({ type: t }))
      }
      expect(onMessage).not.toHaveBeenCalled()
    })

    it('filters out system messages with subtype post_turn_summary', () => {
      triggerEvent('message', JSON.stringify({ type: 'system', subtype: 'post_turn_summary' }))
      expect(onMessage).not.toHaveBeenCalled()
    })

    it('handles multiple lines in a single event', () => {
      const msg1 = { type: 'assistant', message: 'msg1' }
      const msg2 = { type: 'assistant', message: 'msg2' }
      triggerEvent('message', JSON.stringify(msg1) + '\n' + JSON.stringify(msg2) + '\n  \n')
      expect(onMessage).toHaveBeenCalledTimes(2)
      expect(onMessage).toHaveBeenNthCalledWith(1, msg1)
      expect(onMessage).toHaveBeenNthCalledWith(2, msg2)
    })
  })

  describe('sendMessage', () => {
    it('returns false if not connected', () => {
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, { onMessage: () => {}, onPermissionRequest: () => {} })

      expect(manager.sendMessage('hello')).toBe(false)
    })

    it('returns false if socket is not OPEN', () => {
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, { onMessage: () => {}, onPermissionRequest: () => {} })
      manager.connect()
      mockWebSocket.readyState = 3 // CLOSED
      expect(manager.sendMessage('hello')).toBe(false)
    })

    it('sends correctly formatted user message and returns true', () => {
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, { onMessage: () => {}, onPermissionRequest: () => {} })
      manager.connect()
      mockWebSocket.readyState = 1 // OPEN

      expect(manager.sendMessage('hello')).toBe(true)
      expect(mockWebSocket.send).toHaveBeenCalled()

      const sent = JSON.parse(mockWebSocket.send.mock.calls[0][0])
      expect(sent).toEqual({
        type: 'user',
        message: {
          role: 'user',
          content: 'hello',
        },
        parent_tool_use_id: null,
        session_id: '',
      })
    })
  })

  describe('respondToPermissionRequest', () => {
    let manager: any

    beforeEach(() => {
      manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, { onMessage: () => {}, onPermissionRequest: () => {} })
      manager.connect()
    })

    it('does nothing if not connected', () => {
      mockWebSocket.readyState = 3 // CLOSED
      manager.respondToPermissionRequest('req-1', { behavior: 'allow' })
      expect(mockWebSocket.send).not.toHaveBeenCalled()
    })

    it('sends allow response correctly', () => {
      manager.respondToPermissionRequest('req-1', { behavior: 'allow', updatedInput: { arg1: 'val1' } })

      const sent = JSON.parse(mockWebSocket.send.mock.calls[0][0])
      expect(sent).toEqual({
        type: 'control_response',
        response: {
          subtype: 'success',
          request_id: 'req-1',
          response: {
            behavior: 'allow',
            updatedInput: { arg1: 'val1' }
          }
        }
      })
    })

    it('sends reject response correctly', () => {
      manager.respondToPermissionRequest('req-1', { behavior: 'reject', message: 'no way' })

      const sent = JSON.parse(mockWebSocket.send.mock.calls[0][0])
      expect(sent).toEqual({
        type: 'control_response',
        response: {
          subtype: 'success',
          request_id: 'req-1',
          response: {
            behavior: 'reject',
            message: 'no way'
          }
        }
      })
    })
  })

  describe('sendInterrupt', () => {
    let manager: any

    beforeEach(() => {
      manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, { onMessage: () => {}, onPermissionRequest: () => {} })
      manager.connect()
    })

    it('does nothing if not connected', () => {
      mockWebSocket.readyState = 3 // CLOSED
      manager.sendInterrupt()
      expect(mockWebSocket.send).not.toHaveBeenCalled()
    })

    it('sends interrupt request with random UUID', () => {
      const originalUUID = crypto.randomUUID
      // @ts-ignore
      crypto.randomUUID = () => 'mocked-uuid-123'

      try {
        manager.sendInterrupt()
        const sent = JSON.parse(mockWebSocket.send.mock.calls[0][0])
        expect(sent).toEqual({
          type: 'control_request',
          request_id: 'mocked-uuid-123',
          request: {
            subtype: 'interrupt'
          }
        })
      } finally {
        crypto.randomUUID = originalUUID
      }
    })
  })

  describe('disconnect', () => {
    it('closes socket and nullifies it', () => {
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, { onMessage: () => {}, onPermissionRequest: () => {} })
      manager.connect()

      manager.disconnect()
      expect(mockWebSocket.close).toHaveBeenCalled()

      // Additional disconnect should do nothing
      mockWebSocket.close.mockClear()
      manager.disconnect()
      expect(mockWebSocket.close).not.toHaveBeenCalled()
    })
  })

  describe('isConnected', () => {
    it('returns true if readyState is OPEN', () => {
      const manager = new DirectConnectSessionManager({
        serverUrl: 'http://localhost',
        sessionId: 'sess-123',
        wsUrl: 'ws://localhost',
      }, { onMessage: () => {}, onPermissionRequest: () => {} })

      expect(manager.isConnected()).toBe(false)

      manager.connect()
      expect(manager.isConnected()).toBe(true)

      mockWebSocket.readyState = 3 // CLOSED
      expect(manager.isConnected()).toBe(false)

      manager.disconnect()
      expect(manager.isConnected()).toBe(false)
    })
  })
})
