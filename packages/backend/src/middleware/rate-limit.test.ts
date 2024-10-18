import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {app} from "@/app";

describe('Hono Rate Limit Middleware', () => {

  beforeEach(() => {
    // Create a new RateLimiter instance for each test
  });


  it('should allow requests within the rate limit', async () => {
    for (let i = 0; i < 20; i++) {
      const res = await app.request('/api/ping');
      expect(res.status).toBe(200);
      expect(await res.json()).deep.eq({data:"pong"})
    }
  });

  it('should block requests exceeding the rate limit', async () => {
    for (let i = 0; i < 20; i++) {
      await app.request('/api/ping');
    }

    const res = await app.request('/api/ping');
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body).toEqual({ error: 'Rate limit exceeded' });
  });

  it('should set appropriate headers', async () => {
    const res = await app.request('/api/ping');

    expect(res.headers.get('RateLimit-Limit')).toBe('20');
    expect(res.headers.get('RateLimit-Remaining')).toBe('19');
    expect(res.headers.get('RateLimit-Reset')).toBeTruthy();
  });

  it('should reset the rate limit after the time window', async () => {
    // Make 20 requests
    for (let i = 0; i < 20; i++) {
      await app.request('/api/ping');
    }

    // Wait for 1 min
    await new Promise(resolve => setTimeout(resolve, 65 * 1000));

    // Make another request
    const res = await app.request('/api/ping');
    expect(res.status).toBe(200);
    expect(await res.json()).deep.eq({data:"pong"})
  }, {
    timeout: 70 * 1000,
  });
});