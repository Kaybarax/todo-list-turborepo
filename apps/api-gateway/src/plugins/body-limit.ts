import { Elysia } from 'elysia';

import { config } from '../config/env';
import { GatewayPayloadTooLargeError } from '../errors';

export const bodyLimitPlugin = new Elysia({ name: 'body-limit' })
  .onRequest(({ request }) => {
    const contentLength = request.headers.get('content-length');
    if (!contentLength) return undefined;

    const parsed = Number(contentLength);
    if (Number.isFinite(parsed) && parsed > config.proxy.bodyLimitBytes) {
      throw new GatewayPayloadTooLargeError(config.proxy.bodyLimitBytes);
    }

    return undefined;
  })
  .as('global');
