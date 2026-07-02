import { Elysia } from 'elysia';

import { upstreams } from '../config/upstreams';
import { type Upstream } from '../types/upstream';

const READINESS_TIMEOUT_MS = 5_000;

const gatewayMetadata = () => ({
  service: 'api-gateway',
  version: '0.0.1',
  timestamp: new Date().toISOString(),
});

export interface UpstreamHealth {
  id: Upstream['id'];
  serviceName: Upstream['serviceName'];
  status: 'healthy' | 'unhealthy';
  latency: number;
  error?: string;
}

async function checkUpstreamHealth(upstream: Upstream): Promise<UpstreamHealth> {
  const url = `${upstream.baseUrl}${upstream.healthPath}`;
  const startedAt = performance.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), READINESS_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    const latency = Math.round((performance.now() - startedAt) * 100) / 100;

    if (response.ok) {
      return { id: upstream.id, serviceName: upstream.serviceName, status: 'healthy', latency };
    }

    return {
      id: upstream.id,
      serviceName: upstream.serviceName,
      status: 'unhealthy',
      latency,
      error: `HTTP ${response.status}`,
    };
  } catch (error) {
    const latency = Math.round((performance.now() - startedAt) * 100) / 100;
    return {
      id: upstream.id,
      serviceName: upstream.serviceName,
      status: 'unhealthy',
      latency,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function readinessHandler() {
  const upstreamEntries = Object.values(upstreams);
  const results = await Promise.all(upstreamEntries.map(checkUpstreamHealth));

  const healthyCount = results.filter(r => r.status === 'healthy').length;
  const totalCount = results.length;

  let status: 'ready' | 'partial-down' | 'all-down';
  if (healthyCount === totalCount) {
    status = 'ready';
  } else if (healthyCount === 0) {
    status = 'all-down';
  } else {
    status = 'partial-down';
  }

  return {
    status,
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    upstreams: results,
  };
}

export const indexRoute = new Elysia()
  .get('/api/v1', gatewayMetadata)
  .get('/api/v1/health', gatewayMetadata)
  .get('/api/v1/health/ready', readinessHandler);
