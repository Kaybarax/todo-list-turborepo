import { Elysia } from 'elysia';

export const REQUEST_ID_HEADER = 'x-request-id';
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;
const requestIds = new WeakMap<Request, string>();

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

export const requestIdPlugin = new Elysia({ name: 'request-id' })
  .onRequest(({ request, set }) => {
    set.headers[REQUEST_ID_HEADER] = getRequestId(request);
  })
  .derive(({ request, set }) => {
    const requestId = getRequestId(request);
    set.headers[REQUEST_ID_HEADER] = requestId;

    return { requestId };
  })
  .onAfterHandle(({ requestId, set }) => {
    set.headers[REQUEST_ID_HEADER] = requestId;
  })
  .as('global');
