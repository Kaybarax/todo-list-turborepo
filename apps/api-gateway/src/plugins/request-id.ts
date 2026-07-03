import { Elysia } from 'elysia';

export const REQUEST_ID_HEADER = 'x-request-id';
export const CORRELATION_ID_HEADER = 'x-correlation-id';
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;
const requestIds = new WeakMap<Request, string>();
const correlationIds = new WeakMap<Request, string>();

export function getRequestId(request: Request): string {
  const existing = requestIds.get(request);
  if (existing) {
    return existing;
  }

  const incoming = request.headers.get(REQUEST_ID_HEADER);
  if (incoming && REQUEST_ID_PATTERN.test(incoming)) {
    requestIds.set(request, incoming);
    return incoming;
  }

  const generated = crypto.randomUUID();
  requestIds.set(request, generated);
  return generated;
}

export function getCorrelationId(request: Request): string {
  const existing = correlationIds.get(request);
  if (existing) {
    return existing;
  }

  const incoming = request.headers.get(CORRELATION_ID_HEADER);
  if (incoming && REQUEST_ID_PATTERN.test(incoming)) {
    correlationIds.set(request, incoming);
    return incoming;
  }

  // Use the request ID as the correlation ID if no explicit x-correlation-id was provided
  const generated = getRequestId(request);
  correlationIds.set(request, generated);
  return generated;
}

export const requestIdPlugin = new Elysia({ name: 'request-id' })
  .onRequest(({ request, set }) => {
    set.headers[REQUEST_ID_HEADER] = getRequestId(request);
    set.headers[CORRELATION_ID_HEADER] = getCorrelationId(request);
  })
  .derive(({ request, set }) => {
    const requestId = getRequestId(request);
    const correlationId = getCorrelationId(request);
    set.headers[REQUEST_ID_HEADER] = requestId;
    set.headers[CORRELATION_ID_HEADER] = correlationId;

    return { requestId, correlationId };
  })
  .onAfterHandle(({ requestId, correlationId, set }) => {
    set.headers[REQUEST_ID_HEADER] = requestId;
    set.headers[CORRELATION_ID_HEADER] = correlationId;
  })
  .as('global');
