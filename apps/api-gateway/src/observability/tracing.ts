import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';

import { OTEL_SERVICE_NAME } from './telemetry';

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

if (endpoint) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': OTEL_SERVICE_NAME,
    }),
    traceExporter: new OTLPTraceExporter({ url: endpoint }),
  });

  sdk.start();
  console.log(`OTEL SDK started, exporting to ${endpoint}`);
}

export {};
