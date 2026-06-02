export type GatewayErrorCode =
  | 'GW_ROUTE_NOT_FOUND'
  | 'GW_METHOD_NOT_ALLOWED'
  | 'GW_AUTH_REQUIRED'
  | 'GW_AUTH_INVALID'
  | 'GW_PAYLOAD_TOO_LARGE'
  | 'GW_UPSTREAM_TIMEOUT'
  | 'GW_UPSTREAM_UNAVAILABLE';

export class GatewayError extends Error {
  constructor(
    message: string,
    public readonly code: GatewayErrorCode,
    public readonly status: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class GatewayRouteNotFoundError extends GatewayError {
  constructor(path: string) {
    super(`No gateway route matched ${path}`, 'GW_ROUTE_NOT_FOUND', 404);
  }
}

export class GatewayMethodNotAllowedError extends GatewayError {
  constructor(path: string) {
    super(`Gateway route matched ${path}, but not for this method`, 'GW_METHOD_NOT_ALLOWED', 405);
  }
}

export class GatewayAuthRequiredError extends GatewayError {
  constructor(message = 'Authentication is required') {
    super(message, 'GW_AUTH_REQUIRED', 401);
  }
}

export class GatewayAuthInvalidError extends GatewayError {
  constructor(message = 'Authentication is invalid') {
    super(message, 'GW_AUTH_INVALID', 401);
  }
}

export class GatewayPayloadTooLargeError extends GatewayError {
  constructor(limitBytes: number) {
    super(`Request body exceeds the ${limitBytes} byte limit`, 'GW_PAYLOAD_TOO_LARGE', 413);
  }
}

export class GatewayUpstreamTimeoutError extends GatewayError {
  constructor(message = 'Upstream request timed out') {
    super(message, 'GW_UPSTREAM_TIMEOUT', 504);
  }
}

export class GatewayUpstreamUnavailableError extends GatewayError {
  constructor(message = 'Upstream is unavailable') {
    super(message, 'GW_UPSTREAM_UNAVAILABLE', 503);
  }
}

export function errorTitle(code: GatewayErrorCode): string {
  switch (code) {
    case 'GW_ROUTE_NOT_FOUND':
      return 'Route Not Found';
    case 'GW_METHOD_NOT_ALLOWED':
      return 'Method Not Allowed';
    case 'GW_AUTH_REQUIRED':
      return 'Unauthorized';
    case 'GW_AUTH_INVALID':
      return 'Unauthorized';
    case 'GW_PAYLOAD_TOO_LARGE':
      return 'Payload Too Large';
    case 'GW_UPSTREAM_TIMEOUT':
      return 'Gateway Timeout';
    case 'GW_UPSTREAM_UNAVAILABLE':
      return 'Service Unavailable';
  }
}
