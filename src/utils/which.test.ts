import { test, expect } from 'bun:test'
import { which, whichSync } from './which.js'
import { statSync } from 'node:fs'

test('which handles malicious inputs securely', async () => {
  // Should not execute echo/touch
  await which('echo vulnerable && touch test_pwned_1')
  let vulnerable = true
  try {
    statSync('test_pwned_1')
  } catch {
    vulnerable = false
  }
  expect(vulnerable).toBe(false)
})

test('whichSync handles malicious inputs securely', () => {
  // Should not execute echo/touch
  whichSync('echo vulnerable && touch test_pwned_2')
  let vulnerable = true
  try {
    statSync('test_pwned_2')
  } catch {
    vulnerable = false
  }
  expect(vulnerable).toBe(false)
})
