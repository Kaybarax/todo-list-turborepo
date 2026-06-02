import { config } from './env';
import { type Upstream } from '../types/upstream';

export const upstreams: Record<Upstream['id'], Upstream> = {
  'nest-api': {
    id: 'nest-api',
    baseUrl: config.upstreams.nestApiUrl,
    healthPath: '/api/v1/health/ready',
    serviceName: 'todo-api',
  },
  'bun-api': {
    id: 'bun-api',
    baseUrl: config.upstreams.bunApiUrl,
    healthPath: '/api/v1/health/ready',
    serviceName: 'todo-api-bun',
  },
};
