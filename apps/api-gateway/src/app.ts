import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';

import { createGraphQLRoute } from './graphql';
import { bodyLimitPlugin } from './plugins/body-limit';
import { corsPolicyPlugin } from './plugins/cors';
import { errorNormalizerPlugin } from './plugins/errors';
import { structuredLoggingPlugin } from './plugins/logging';
import { rateLimitPlugin } from './plugins/rate-limit';
import { requestIdPlugin } from './plugins/request-id';
import { securityHeadersPlugin } from './plugins/security';
import { indexRoute } from './routes/index.route';
import { restProxyRoute } from './routes/rest-proxy.route';

export const app = new Elysia()
  .use(errorNormalizerPlugin)
  .use(requestIdPlugin)
  .use(structuredLoggingPlugin)
  .use(corsPolicyPlugin)
  .use(securityHeadersPlugin)
  .use(bodyLimitPlugin)
  .use(rateLimitPlugin)
  .use(
    openapi({
      path: '/api/docs',
      documentation: {
        info: {
          title: 'API Gateway',
          description: 'Unified API Gateway for the Todo application',
          version: '0.0.1',
        },
        tags: [{ name: 'Gateway', description: 'Gateway general endpoints' }],
      },
      exclude: {
        paths: ['/api/docs', '/api/docs/json'],
      },
    }),
  )
  .use(indexRoute)
  .use(restProxyRoute)
  .use(createGraphQLRoute());
