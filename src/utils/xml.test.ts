import { expect, test, describe } from 'bun:test'
import { extractTag } from './xml.js'

describe('extractTag', () => {
  test('extracts basic tag content', () => {
    expect(extractTag('<div>hello</div>', 'div')).toBe('hello')
  })

  test('extracts tag with attributes', () => {
    expect(extractTag('<div class="foo" id="bar">hello</div>', 'div')).toBe('hello')
  })

  test('extracts multiline content', () => {
    const html = `<div>
      line 1
      line 2
    </div>`
    expect(extractTag(html, 'div')).toBe('\n      line 1\n      line 2\n    ')
  })

  test('returns the first match for multiple tags', () => {
    expect(extractTag('<div>first</div><div>second</div>', 'div')).toBe('first')
  })

  test('returns null for non-existent tags', () => {
    expect(extractTag('<div>hello</div>', 'span')).toBeNull()
  })

  test('returns null for empty input or tag name', () => {
    expect(extractTag('', 'div')).toBeNull()
    expect(extractTag('<div>hello</div>', '')).toBeNull()
    expect(extractTag('   ', 'div')).toBeNull()
    expect(extractTag('<div>hello</div>', '   ')).toBeNull()
  })

  test('handles nested tags of different types', () => {
    expect(extractTag('<div><span>nested</span></div>', 'div')).toBe('<span>nested</span>')
  })

  test('handles nested tags of the same type', () => {
    const nested = '<div>parent <div>child</div> end</div>'
    expect(extractTag(nested, 'div')).toBe('parent <div>child</div> end')
  })

  test('is case-insensitive for tag names', () => {
    expect(extractTag('<DIV>hello</DIV>', 'div')).toBe('hello')
    expect(extractTag('<div>hello</div>', 'DIV')).toBe('hello')
  })

  test('handles tags with special characters in name', () => {
     expect(extractTag('<my-tag>content</my-tag>', 'my-tag')).toBe('content')
  })
})
