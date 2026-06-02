export type UpstreamId = 'gateway' | 'nest-api' | 'bun-api';

export interface Upstream {
  id: Exclude<UpstreamId, 'gateway'>;
  baseUrl: string;
  healthPath: string;
  serviceName: string;
}
