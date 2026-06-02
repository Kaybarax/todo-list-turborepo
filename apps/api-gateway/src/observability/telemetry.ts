import { SpanKind, SpanStatusCode, context, propagation, trace } from '@opentelemetry/api';

import { type GatewayRequestContext } from './request-context';

export const OTEL_SERVICE_NAME = 'todo-api-gateway';

type SpanAttributes = Record<string, string | number | boolean | undefined>;

export type RecordedSpan = {
  name: string;
  serviceName: string;
  attributes: SpanAttributes;
  durationMs: number;
  traceparent?: string;
  tracestate?: string;
};

const recordedSpans: RecordedSpan[] = [];
const tracer = trace.getTracer(OTEL_SERVICE_NAME);

function roundMs(value: number): number {
  return Math.round(value * 100) / 100;
}

function cleanAttributes(attributes: SpanAttributes): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(attributes).filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined),
  );
}

function incomingTraceContext(request: Request) {
  const carrier = Object.fromEntries(request.headers.entries());
  return propagation.extract(context.active(), carrier);
}

export function startGatewaySpan(request: Request) {
  const startedAt = performance.now();
  const span = tracer.startSpan(
    'gateway.request',
    {
      kind: SpanKind.SERVER,
      attributes: {
        'service.name': OTEL_SERVICE_NAME,
        'http.method': request.method,
        'http.route': new URL(request.url).pathname,
      },
    },
    incomingTraceContext(request),
  );

  return (requestContext: GatewayRequestContext, status: number) => {
    const attributes = cleanAttributes({
      'gateway.route_id': requestContext.routeId,
      'gateway.upstream': requestContext.upstream ?? 'gateway',
      'http.method': request.method,
      'http.route': new URL(request.url).pathname,
      'http.status_code': status,
      'gateway.retry_count': requestContext.retryCount ?? 0,
      'gateway.fallback_used': requestContext.fallbackUsed ?? false,
    });
    span.setAttributes(attributes);
    if (status >= 500) span.setStatus({ code: SpanStatusCode.ERROR });
    span.end();
    recordedSpans.push({
      name: 'gateway.request',
      serviceName: OTEL_SERVICE_NAME,
      attributes,
      durationMs: roundMs(performance.now() - startedAt),
      traceparent: request.headers.get('traceparent') ?? undefined,
      tracestate: request.headers.get('tracestate') ?? undefined,
    });
  };
}

export function startUpstreamSpan(request: Request, attributes: SpanAttributes) {
  const startedAt = performance.now();
  const span = tracer.startSpan(
    'gateway.upstream',
    {
      kind: SpanKind.CLIENT,
      attributes: cleanAttributes({
        'service.name': OTEL_SERVICE_NAME,
        'http.method': request.method,
        ...attributes,
      }),
    },
    incomingTraceContext(request),
  );

  return (status: number, retryCount: number, fallbackUsed = false) => {
    const finalAttributes = cleanAttributes({
      'http.method': request.method,
      ...attributes,
      'http.status_code': status,
      'gateway.retry_count': retryCount,
      'gateway.fallback_used': fallbackUsed,
    });
    span.setAttributes(finalAttributes);
    if (status >= 500) span.setStatus({ code: SpanStatusCode.ERROR });
    span.end();
    recordedSpans.push({
      name: 'gateway.upstream',
      serviceName: OTEL_SERVICE_NAME,
      attributes: finalAttributes,
      durationMs: roundMs(performance.now() - startedAt),
      traceparent: request.headers.get('traceparent') ?? undefined,
      tracestate: request.headers.get('tracestate') ?? undefined,
    });
  };
}

export function getRecordedSpans(): RecordedSpan[] {
  return [...recordedSpans];
}

export function resetRecordedSpans(): void {
  recordedSpans.length = 0;
}
