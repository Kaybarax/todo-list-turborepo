import { type GatewayMethod, type GatewayRoute } from '../types/route';

const IDEMPOTENT_METHODS = new Set<GatewayMethod>(['GET', 'HEAD', 'OPTIONS']);

export function shouldRetry(method: string, route: GatewayRoute, attempt: number, response?: Response): boolean {
  if (attempt >= route.retries) return false;
  if (!IDEMPOTENT_METHODS.has(method.toUpperCase() as GatewayMethod)) return false;
  if (!response) return true;
  return [502, 503, 504].includes(response.status);
}
