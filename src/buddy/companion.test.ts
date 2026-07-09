import { describe, it, expect, mock } from 'bun:test'

// We need to mock getGlobalConfig properly for getCompanion
let mockConfig: any = {}

mock.module('../utils/config.js', () => {
  return {
    getGlobalConfig: () => mockConfig,
  }
})

// Top-level await for dynamic import to keep describe block synchronous
const { getCompanion } = await import('./companion.js')

describe('getCompanion', () => {
  it('should return undefined if no companion is stored in config', () => {
    mockConfig = {}
    expect(getCompanion()).toBeUndefined()
  })

  it('should return a combined Companion object if one is stored in config', () => {
    const storedCompanion = {
      name: 'Testy',
      personality: 'bouncy',
      hatchedAt: 1234567890
    }

    mockConfig = {
      companion: storedCompanion,
      userID: 'test-user-id'
    }

    const companion = getCompanion()

    // Check it's not undefined
    expect(companion).toBeDefined()

    // Check that stored soul properties (name, personality, hatchedAt) are preserved
    expect(companion?.name).toBe('Testy')
    expect(companion?.personality).toBe('bouncy')
    expect(companion?.hatchedAt).toBe(1234567890)

    // Check that regenerated bones properties are present
    expect(companion?.rarity).toBeDefined()
    expect(companion?.species).toBeDefined()
    expect(companion?.eye).toBeDefined()
    expect(companion?.hat).toBeDefined()
    expect(companion?.shiny).toBeDefined()
    expect(companion?.stats).toBeDefined()
  })
})
