import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

let server: any;

beforeAll(() => {
  // app is exported and does not listen in test env
});

describe('HTTP integration', () => {
  it('GET /routes returns array', async () => {
    const res = await request(app).get('/routes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /routes/:id/baseline sets baseline', async () => {
    const res = await request(app).post('/routes/R002/baseline');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.route.routeId).toBe('R002');
  });

  it('GET /routes/comparison returns comparison object', async () => {
    const res = await request(app).get('/routes/comparison');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('baseline');
    expect(res.body).toHaveProperty('comparison');
  });
});
