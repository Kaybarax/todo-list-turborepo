import { Elysia } from 'elysia';

const gatewayMetadata = () => ({
  service: 'api-gateway',
  version: '0.0.1',
  timestamp: new Date().toISOString(),
});

export const indexRoute = new Elysia()
  .get('/api/v1', gatewayMetadata)
  .get('/api/v1/health', gatewayMetadata)
  .get('/api/v1/health/ready', () => ({
    status: 'ready',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  }));
