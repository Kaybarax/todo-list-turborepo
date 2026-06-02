import { Elysia } from 'elysia';

import { GatewayError, GatewayRouteNotFoundError, errorTitle } from '../errors';
import { getGatewayRequestContext } from '../observability/request-context';
import { startGatewaySpan } from '../observability/telemetry';
import { getRequestId } from './request-id';

export const errorNormalizerPlugin = new Elysia({ name: 'error-normalizer' })
  .onError(({ code, error, path, request, set }) => {
    const requestId = String(set.headers['x-request-id'] ?? getRequestId(request));
    set.headers['x-request-id'] = requestId;
    const gatewayError =
      error instanceof GatewayError ? error : code === 'NOT_FOUND' ? new GatewayRouteNotFoundError(path) : undefined;

    if (gatewayError) {
      set.status = gatewayError.status;
      const requestContext = getGatewayRequestContext(request);
      startGatewaySpan(request)(requestContext, gatewayError.status);
      console.info(
        JSON.stringify({
          level: 'info',
          event: 'gateway_request',
          method: request.method,
          path,
          routeId: requestContext.routeId ?? path,
          status: gatewayError.status,
          durationMs: 0,
          requestId,
          upstream: requestContext.upstream ?? 'gateway',
          upstreamLatencyMs: requestContext.upstreamLatencyMs,
          retryCount: requestContext.retryCount ?? 0,
          fallbackUsed: requestContext.fallbackUsed ?? false,
        }),
      );

      return {
        error: errorTitle(gatewayError.code),
        errorCode: gatewayError.code,
        message: gatewayError.message,
        requestId,
      };
    }

    set.status = 500;
    const requestContext = getGatewayRequestContext(request);
    startGatewaySpan(request)(requestContext, 500);
    console.info(
      JSON.stringify({
        level: 'info',
        event: 'gateway_request',
        method: request.method,
        path,
        routeId: requestContext.routeId ?? path,
        status: 500,
        durationMs: 0,
        requestId,
        upstream: requestContext.upstream ?? 'gateway',
        upstreamLatencyMs: requestContext.upstreamLatencyMs,
        retryCount: requestContext.retryCount ?? 0,
        fallbackUsed: requestContext.fallbackUsed ?? false,
      }),
    );
    return {
      error: 'Internal Server Error',
      errorCode: 'GW_INTERNAL_ERROR',
      message: 'The gateway encountered an unexpected error',
      requestId,
    };
  })
  .as('global');
