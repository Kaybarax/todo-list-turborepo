import { Elysia } from 'elysia';

import { checkGatewayHealth } from '../services/health';

const gatewayMetadata = () => ({
  service: 'api-gateway',
  version: '0.0.1',
  timestamp: new Date().toISOString(),
});

export const indexRoute = new Elysia()
  .get('/api/v1', gatewayMetadata)
  .get('/api/v1/health', async () => {
    const health = await checkGatewayHealth();
    return health;
  })
  .get('/api/v1/health/ready', async ({ set }) => {
    const health = await checkGatewayHealth();
    set.headers['cache-control'] = 'no-cache, no-store, must-revalidate';

    if (health.status === 'unhealthy') {
      set.status = 503;
    }

    return {
      status: health.status === 'healthy' ? 'ready' : health.status,
      service: health.service,
      version: health.version,
      timestamp: health.timestamp,
      upstreams: health.upstreams,
      healthyCount: health.healthyCount,
      unhealthyCount: health.unhealthyCount,
      totalCount: health.totalCount,
    };
  });
