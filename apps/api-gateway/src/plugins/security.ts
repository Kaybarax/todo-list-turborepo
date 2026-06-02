import { Elysia } from 'elysia';

const SECURITY_HEADERS: Record<string, string> = {
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
  'referrer-policy': 'no-referrer',
  'strict-transport-security': 'max-age=15552000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
};

function applySecurityHeaders(headers: Record<string, string | number>): void {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers[name] = value;
  }
}

export const securityHeadersPlugin = new Elysia({ name: 'security-headers' })
  .onRequest(({ set }) => {
    applySecurityHeaders(set.headers);
  })
  .onAfterHandle(({ set }) => {
    applySecurityHeaders(set.headers);
  })
  .as('global');
