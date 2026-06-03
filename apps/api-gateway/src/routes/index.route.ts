import { Elysia } from 'elysia';

import { OTEL_SERVICE_NAME } from '../observability/telemetry';

const startedAt = Date.now();

const gatewayMetadata = () => ({
  service: 'api-gateway',
  version: '0.0.1',
  timestamp: new Date().toISOString(),
});

export const indexRoute = new Elysia()
  .get('/api/v1', gatewayMetadata)
  .get('/api/v1/health', () => {
    const base = gatewayMetadata();
    const uptime = Math.floor((Date.now() - startedAt) / 1000);
    const telemetry = {
      enabled: !!(process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? process.env.JAEGER_ENDPOINT),
      serviceName: OTEL_SERVICE_NAME,
    };
    return { ...base, uptime, telemetry };
  })
  .get('/api/v1/health/ready', () => ({
    status: 'ready',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  }));
