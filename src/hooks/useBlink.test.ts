import { describe, expect, it, mock, beforeEach } from 'bun:test'

const mockUseTerminalFocus = mock(() => true)
const mockUseAnimationFrame = mock((interval: number | null) => [() => {}, 0])

mock.module('../ink.js', () => ({
  useTerminalFocus: mockUseTerminalFocus,
  useAnimationFrame: mockUseAnimationFrame,
}))

describe('useBlink', () => {
  let useBlink: any;

  beforeEach(async () => {
    mockUseTerminalFocus.mockClear()
    mockUseAnimationFrame.mockClear()
    mockUseTerminalFocus.mockImplementation(() => true)
    mockUseAnimationFrame.mockImplementation(() => [() => {}, 0])

    // dynamically import to ensure mocks apply
    const mod = await import('./useBlink.ts')
    useBlink = mod.useBlink
  })

  it('should return true and pause animation when not enabled', () => {
    mockUseTerminalFocus.mockImplementation(() => true)
    const [ref, isVisible] = useBlink(false)

    expect(isVisible).toBe(true)
    expect(mockUseAnimationFrame).toHaveBeenCalledWith(null)
  })

  it('should return true and pause animation when terminal is not focused', () => {
    mockUseTerminalFocus.mockImplementation(() => false)
    const [ref, isVisible] = useBlink(true)

    expect(isVisible).toBe(true)
    expect(mockUseAnimationFrame).toHaveBeenCalledWith(null)
  })

  it('should blink visible (true) when time is in the first half of the interval', () => {
    mockUseTerminalFocus.mockImplementation(() => true)
    // Time 0, interval 600 -> Math.floor(0/600) = 0 % 2 === 0 (true)
    mockUseAnimationFrame.mockImplementation(() => [() => {}, 0])
    const [ref, isVisible] = useBlink(true)

    expect(isVisible).toBe(true)
    expect(mockUseAnimationFrame).toHaveBeenCalledWith(600)
  })

  it('should blink invisible (false) when time is in the second half of the interval', () => {
    mockUseTerminalFocus.mockImplementation(() => true)
    // Time 600, interval 600 -> Math.floor(600/600) = 1 % 2 !== 0 (false)
    mockUseAnimationFrame.mockImplementation(() => [() => {}, 600])
    const [ref, isVisible] = useBlink(true)

    expect(isVisible).toBe(false)
    expect(mockUseAnimationFrame).toHaveBeenCalledWith(600)
  })

  it('should use custom interval when provided', () => {
    mockUseTerminalFocus.mockImplementation(() => true)
    mockUseAnimationFrame.mockImplementation(() => [() => {}, 1000]) // 1000/1000 = 1 (false)

    const [ref, isVisible] = useBlink(true, 1000)

    expect(isVisible).toBe(false)
    expect(mockUseAnimationFrame).toHaveBeenCalledWith(1000)
  })
})
