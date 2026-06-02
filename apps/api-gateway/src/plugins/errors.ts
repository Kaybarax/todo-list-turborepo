import { Elysia } from 'elysia';

import { GatewayError, GatewayRouteNotFoundError, errorTitle } from '../errors';
import { getRequestId } from './request-id';

export const errorNormalizerPlugin = new Elysia({ name: 'error-normalizer' })
  .onError(({ code, error, path, request, set }) => {
    const requestId = String(set.headers['x-request-id'] ?? getRequestId(request));
    set.headers['x-request-id'] = requestId;
    const gatewayError =
      error instanceof GatewayError ? error : code === 'NOT_FOUND' ? new GatewayRouteNotFoundError(path) : undefined;

    if (gatewayError) {
      set.status = gatewayError.status;

      return {
        error: errorTitle(gatewayError.code),
        errorCode: gatewayError.code,
        message: gatewayError.message,
        requestId,
      };
    }

    set.status = 500;
    return {
      error: 'Internal Server Error',
      errorCode: 'GW_INTERNAL_ERROR',
      message: 'The gateway encountered an unexpected error',
      requestId,
    };
  })
  .as('global');
