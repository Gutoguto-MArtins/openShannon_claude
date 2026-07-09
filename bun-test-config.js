import { mock } from 'bun:test'
mock.module('bun:bundle', () => ({
  feature: () => false,
}))
