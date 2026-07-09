import { test, expect, mock, describe, afterEach, beforeEach } from 'bun:test'

mock.module('bundle', () => ({ feature: () => true }))
mock.module('bun:bundle', () => ({ feature: () => true }))

mock.module('../../bridge/bridgeConfig.js', () => ({
  getBridgeAccessToken: () => 'fake-token',
  getBridgeBaseUrlOverride: () => 'http://fake',
}))

mock.module('../../constants/oauth.js', () => ({
  getOauthConfig: () => ({ BASE_API_URL: 'http://fake' })
}))

import * as fsPromises from 'node:fs/promises'

const readFileMock = mock().mockImplementation(async () => {
  throw new Error('Mock read error')
})

mock.module('fs/promises', () => {
  return {
    ...fsPromises,
    readFile: readFileMock,
  }
})

describe('uploadBriefAttachment', () => {
  afterEach(() => {
    readFileMock.mockClear()
  })

  test('should return undefined if file read fails', async () => {
    const { uploadBriefAttachment } = await import('./upload.ts')

    const result = await uploadBriefAttachment('test.txt', 100, {
      replBridgeEnabled: true
    })

    expect(result).toBeUndefined()
    expect(readFileMock).toHaveBeenCalledWith('test.txt')
  })
})
