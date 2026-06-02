import { Buffer } from 'node:buffer';
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

import { config } from '../config/env';
import { GatewayAuthInvalidError, GatewayAuthRequiredError } from '../errors';
import { type GatewayRoute } from '../types/route';

export interface AuthContext {
  userId: string;
  email?: string;
  userIdHash: string;
}

type JwtPayload = {
  sub?: unknown;
  email?: unknown;
  exp?: unknown;
};

const authContexts = new WeakMap<Request, AuthContext>();

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function base64UrlEncode(value: Buffer | string): string {
  return Buffer.from(value).toString('base64url');
}

function signJwtInput(input: string, secret: string): string {
  return createHmac('sha256', secret).update(input).digest('base64url');
}

function parseBearerToken(header: string | null): string {
  if (!header) {
    throw new GatewayAuthRequiredError();
  }

  const match = /^Bearer\s+([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.exec(header);
  if (!match) {
    throw new GatewayAuthInvalidError('Authorization must use Bearer JWT format');
  }

  return match[1];
}

function verifyJwt(token: string): JwtPayload {
  const [headerSegment, payloadSegment, signature] = token.split('.');
  if (!headerSegment || !payloadSegment || !signature) {
    throw new GatewayAuthInvalidError('JWT must contain header, payload, and signature');
  }

  const header = JSON.parse(base64UrlDecode(headerSegment)) as { alg?: unknown };
  if (header.alg !== 'HS256') {
    throw new GatewayAuthInvalidError('JWT algorithm is not supported');
  }

  const signedInput = `${headerSegment}.${payloadSegment}`;
  const expected = signJwtInput(signedInput, config.auth.jwtSecret);
  const received = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (received.length !== expectedBuffer.length || !timingSafeEqual(received, expectedBuffer)) {
    throw new GatewayAuthInvalidError('JWT signature is invalid');
  }

  const payload = JSON.parse(base64UrlDecode(payloadSegment)) as JwtPayload;
  if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
    throw new GatewayAuthInvalidError('JWT is expired');
  }

  return payload;
}

function buildAuthContext(payload: JwtPayload): AuthContext {
  if (typeof payload.sub !== 'string' || payload.sub.trim() === '') {
    throw new GatewayAuthInvalidError('JWT subject is required');
  }

  return {
    userId: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : undefined,
    userIdHash: createHash('sha256').update(payload.sub).digest('hex').slice(0, 16),
  };
}

export function getAuthContext(request: Request): AuthContext | undefined {
  return authContexts.get(request);
}

export function enforceAuthPolicy(request: Request, route: GatewayRoute): AuthContext | undefined {
  if (route.auth === 'public') {
    return undefined;
  }

  const token = parseBearerToken(request.headers.get('authorization'));
  const payload = config.auth.authValidateLocally ? verifyJwt(token) : {};
  const context = buildAuthContext(payload);
  authContexts.set(request, context);
  return context;
}

export function signTestJwt(payload: Record<string, unknown>, secret = config.auth.jwtSecret): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = signJwtInput(`${header}.${body}`, secret);
  return `${header}.${body}.${signature}`;
}
