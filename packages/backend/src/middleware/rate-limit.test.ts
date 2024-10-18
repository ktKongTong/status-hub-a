import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {app} from "@/app";

describe('Hono Rate Limit Middleware', () => {
  let testIP: string
  beforeEach(() => {

    testIP = `192.0.2.${Math.floor(Math.random() * 256)}`;
  });


  const request = (path: string, options = {}) => {
    return app.request(path, {
      ...options,
      headers: {
        'X-Forwarded-For': testIP as string
      }
    });
  };


  it('should allow requests within the rate limit', async () => {
    for (let i = 0; i < 20; i++) {
      const res = await app.request('/api/ping');
      expect(res.status).toBe(200);
      expect(await res.json()).deep.eq({data:"pong"})
    }
  });

  it('should block requests exceeding the rate limit', async () => {
    for (let i = 0; i < 20; i++) {
      await request('/api/ping');
    }

    const res = await request('/api/ping');
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body).toEqual({ error: "Rate limit exceeded" });
  });

  it('should set appropriate headers', async () => {
    const res = await request('/api/ping');

    expect(res.headers.get('RateLimit-Limit')).toBe('20');
    expect(res.headers.get('RateLimit-Remaining')).toBe('19');
    expect(res.headers.get('RateLimit-Reset')).toBeTruthy();
  });

  it('should reset the rate limit after the time window', async () => {
    vi.useFakeTimers();

    for (let i = 0; i < 20; i++) {
      await request('/api/ping');
    }

    vi.advanceTimersByTime(65 * 1000);

    const res = await request('/api/ping');
    expect(res.status).toBe(200);
    expect(await res.json()).deep.eq({data:"pong"})
    vi.useRealTimers();
  });
});