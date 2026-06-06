import { Elysia } from 'elysia';

import { checkAllUpstreams } from '../health/health-checker';

const gatewayMetadata = () => ({
  service: 'api-gateway',
  version: '0.0.1',
  timestamp: new Date().toISOString(),
});

export const indexRoute = new Elysia()
  .get('/api/v1', gatewayMetadata)
  .get('/api/v1/health', async () => {
    const upstreams = await checkAllUpstreams();
    return {
      ...gatewayMetadata(),
      upstreams,
    };
  })
  .get('/api/v1/health/ready', async () => {
    const upstreams = await checkAllUpstreams();
    const entries = Object.values(upstreams);
    const healthyCount = entries.filter(u => u.status === 'healthy').length;
    const totalCount = entries.length;

    let status: string;
    let ready: boolean;

    if (healthyCount === totalCount) {
      status = 'ready';
      ready = true;
    } else if (healthyCount === 0) {
      status = 'unhealthy';
      ready = false;
    } else {
      status = 'degraded';
      ready = false;
    }

    return {
      status,
      ...gatewayMetadata(),
      ready,
      upstreams,
    };
  });
