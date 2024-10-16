import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
// @ts-ignore
import  supertest from 'supertest';
import {createFetch, Fetch, rofetch} from "./fetch";

vi.mock('./logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('./env', () => ({
  isDebug: vi.fn(()=> true),
}));

// Set up a mock server using Hono
const app = new Hono();
let server: ReturnType<typeof serve>;
let request: any

app.get('/test', (c) => {
  return c.json({ method: 'GET', query: c.req.query() });
});

app.post('/test', async (c) => {
  const body = await c.req.json();
  return c.json({ method: 'POST', body });
});
app.post('/test/form', async (c) => {
  const data = await c.req.formData();
  let body = {}
  data.forEach((k,v) => {
    body[v] = k;
  })
  return c.json({ method: 'POST', body });
});
app.put('/test', async (c) => {
  const body = await c.req.json();
  return c.json({ method: 'PUT', body });
});

app.patch('/test', async (c) => {
  const body = await c.req.json();
  return c.json({ method: 'PATCH', body });
});

app.delete('/test', (c) => {
  return c.json({ method: 'DELETE' });
});

app.get('/error', (c) => {
  return c.json({ error: 'Internal Server Error' }, 500);
});

beforeAll(async () => {
  server = serve({ fetch: app.fetch, port: 0 });
  await new Promise<void>((resolve) => server.addListener('listening', resolve));
  const address = server.address();
  if (address && typeof address === 'object') {
    request = supertest(`http://127.0.0.1:${address.port}`);
  }
});

afterAll((done) => {
  server.close();
});

describe('Fetch class', () => {
  let fetchInstance: Fetch;

  beforeEach(() => {
    fetchInstance = new Fetch(createFetch());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send GET request', async () => {
    const response = await fetchInstance.get(`${request.get('/test').url}?key=value`);
    expect(response).toEqual({ method: 'GET', query: { key: 'value' } });
  });

  it('should send POST request with JSON body', async () => {
    const response = await fetchInstance.post(request.post('/test').url, { json: { key: 'value' } });
    expect(response).toEqual({ method: 'POST', body: { key: 'value' } });
  });

  it('should send POST request with form data', async () => {
    const response = await fetchInstance.post(request.post('/test/form').url, { form: { key: 'value' } });
    expect(response).toEqual({ method: 'POST', body: { key: 'value' } });
  });

  it('should send PUT request', async () => {
    const response = await fetchInstance.put(request.put('/test').url, { json: { key: 'value' } });
    expect(response).toEqual({ method: 'PUT', body: { key: 'value' } });
  });

  it('should send PATCH request', async () => {
    const response = await fetchInstance.patch(request.patch('/test').url, { json: { key: 'value' } });
    expect(response).toEqual({ method: 'PATCH', body: { key: 'value' } });
  });

  it('should send DELETE request', async () => {
    const response = await fetchInstance.delete(request.delete('/test').url);
    expect(response).toEqual({ method: 'DELETE' });
  });

  it('should send HEAD request', async () => {
    const response = await fetchInstance.head(request.head('/test').url);
    expect(response).toBeUndefined();
  });
});

describe('rofetch', () => {
  let mockLogger :any;

  beforeEach(async () => {
    mockLogger = vi.mocked((await import('./logger')).logger);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should retry on error', async () => {
    await expect(()=>rofetch(request.get('/error').url, {
      retry: 2
    }))
      .rejects
      .toThrowError(/500 Internal Server Error/)
    expect(mockLogger.warn).toHaveBeenCalledTimes(2)
  });
});