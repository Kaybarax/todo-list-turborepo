import { routeTable } from '../config/route-table';
import { type GatewayMethod } from '../types/route';

export type ContractPathItem = Partial<Record<Lowercase<GatewayMethod>, { operationId: string; tags: string[] }>>;

function toOpenApiPath(path: string): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

export function gatewayContractPaths(): Record<string, ContractPathItem> {
  return routeTable.reduce<Record<string, ContractPathItem>>((paths, route) => {
    const path = toOpenApiPath(route.publicPath);
    paths[path] ??= {};
    for (const method of route.methods) {
      paths[path][method.toLowerCase() as Lowercase<GatewayMethod>] = {
        operationId: route.openapi.operationId,
        tags: route.tags,
      };
    }
    return paths;
  }, {});
}

export function routeTableOpenApiPaths(): string[] {
  return Object.keys(gatewayContractPaths()).sort();
}
