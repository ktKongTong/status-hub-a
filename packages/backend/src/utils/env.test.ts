import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isDebug, isTesting, isProd, env } from './env'

describe('Environment utility functions', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('isDebug', () => {
    it('should return true when DEBUG is set to "true"', () => {
      process.env.DEBUG = 'true'
      expect(isDebug()).toBe(true)
    })

    it('should return false when DEBUG is not set to "true"', () => {
      process.env.DEBUG = 'false'
      expect(isDebug()).toBe(false)
    })
  })

  describe('isTesting', () => {
    it('should return true when NODE_ENV is set to "test"', () => {
      process.env.NODE_ENV = 'test'
      expect(isTesting()).toBe(true)
    })

    it('should return false when NODE_ENV is not set to "test"', () => {
      process.env.NODE_ENV = 'development'
      expect(isTesting()).toBe(false)
    })
  })

  describe('isProd', () => {
    it('should return true when NODE_ENV is set to "production"', () => {
      process.env.NODE_ENV = 'production'
      expect(isProd()).toBe(true)
    })

    it('should return false when NODE_ENV is not set to "production"', () => {
      process.env.NODE_ENV = 'development'
      expect(isProd()).toBe(false)
    })
  })

  describe('env', () => {
    it('should return the environment variable value if it exists', () => {
      process.env.TEST_VAR = 'test-value'
      expect(env('TEST_VAR')).toBe('test-value')
    })

    it('should return the default value if the environment variable does not exist', () => {
      expect(env('NON_EXISTENT_VAR', 'default')).toBe('default')
    })

    it('should use the converter function if provided', () => {
      process.env.NUMBER_VAR = '42'
      expect(env('NUMBER_VAR', 0, Number)).toBe(42)
    })

    it('should return the default value if the environment variable does not exist and a converter is provided', () => {
      expect(env('NON_EXISTENT_VAR', 0, Number)).toBe(0)
    })

    it('should handle boolean conversions', () => {
      process.env.BOOL_VAR = 'true'
      expect(env('BOOL_VAR', false, (val) => val === 'true')).toBe(true)
    })
  })
})