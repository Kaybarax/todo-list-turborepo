import { upstreams } from '../config/upstreams';
import { type Upstream } from '../types/upstream';

export interface UpstreamHealthResult {
  status: 'healthy' | 'unhealthy';
  latencyMs: number | null;
  error: string | null;
  serviceName: string;
}

export type UpstreamHealthMap = Record<string, UpstreamHealthResult>;

const HEALTH_CHECK_TIMEOUT_MS = 2_000;

export async function checkUpstreamHealth(upstream: Upstream): Promise<UpstreamHealthResult> {
  const url = `${upstream.baseUrl}${upstream.healthPath}`;
  const start = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - start);

    if (response.status >= 500) {
      return {
        status: 'unhealthy',
        latencyMs,
        error: `upstream returned status ${response.status}`,
        serviceName: upstream.serviceName,
      };
    }

    return {
      status: 'healthy',
      latencyMs,
      error: null,
      serviceName: upstream.serviceName,
    };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    let error: string;

    if (err instanceof DOMException && err.name === 'AbortError') {
      error = 'health check timed out';
    } else if (err instanceof TypeError) {
      error = 'connection refused';
    } else {
      error = err instanceof Error ? err.message : 'unknown error';
    }

    return {
      status: 'unhealthy',
      latencyMs,
      error,
      serviceName: upstream.serviceName,
    };
  }
}

export async function checkAllUpstreams(): Promise<UpstreamHealthMap> {
  const upstreamList = Object.values(upstreams);
  const results = await Promise.allSettled(upstreamList.map(upstream => checkUpstreamHealth(upstream)));

  const healthMap: UpstreamHealthMap = {};
  for (let i = 0; i < upstreamList.length; i++) {
    const upstream = upstreamList[i];
    const result = results[i];

    if (result.status === 'fulfilled') {
      healthMap[upstream.id] = result.value;
    } else {
      healthMap[upstream.id] = {
        status: 'unhealthy',
        latencyMs: null,
        error: result.reason instanceof Error ? result.reason.message : 'unknown error',
        serviceName: upstream.serviceName,
      };
    }
  }

  return healthMap;
}
