import { describe, test, expect } from 'vitest'
import { app } from './app'

describe('health check', () => {
  test('/ping', async () => {
    const res = await app.request('/ping')
    const text = await res.json()
    expect(res.status).toBe(200)
    expect(text).toStrictEqual({data: 'pong'})
  })
})