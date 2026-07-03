import { upstreams } from '../config/upstreams';

const HEALTH_TIMEOUT_MS = 3_000;

export interface UpstreamHealth {
  id: string;
  serviceName: string;
  healthy: boolean;
  statusCode?: number;
  error?: string;
}

export interface GatewayHealth {
  service: string;
  version: string;
  timestamp: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  upstreams: UpstreamHealth[];
  healthyCount: number;
  unhealthyCount: number;
  totalCount: number;
}

async function checkUpstream(
  id: string,
  baseUrl: string,
  healthPath: string,
  serviceName: string,
): Promise<UpstreamHealth> {
  try {
    const url = new URL(healthPath, baseUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
    try {
      const response = await fetch(url.toString(), { signal: controller.signal });
      return {
        id,
        serviceName,
        healthy: response.ok,
        statusCode: response.status,
      };
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    const errorLabel =
      error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'unreachable';
    return {
      id,
      serviceName,
      healthy: false,
      error: errorLabel,
    };
  }
}

/**
 * Check health of all upstream services and return an aggregated
 * gateway-health report.
 */
export async function checkGatewayHealth(): Promise<GatewayHealth> {
  const entries = Object.values(upstreams);
  const checks = await Promise.all(
    entries.map(u => checkUpstream(u.id, u.baseUrl, u.healthPath, u.serviceName)),
  );

  const healthyCount = checks.filter(c => c.healthy).length;
  const totalCount = checks.length;
  const unhealthyCount = totalCount - healthyCount;

  const status: GatewayHealth['status'] =
    healthyCount === totalCount
      ? 'healthy'
      : healthyCount > 0
        ? 'degraded'
        : 'unhealthy';

  return {
    service: 'api-gateway',
    version: '0.0.1',
    timestamp: new Date().toISOString(),
    status,
    upstreams: checks,
    healthyCount,
    unhealthyCount,
    totalCount,
  };
}
