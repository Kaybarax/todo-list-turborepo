# @todo/services

API client library for the Todo List platform. Provides typed HTTP clients backed by Axios for interacting with the API gateway.

## Quick start

```typescript
import { ApiClientFactory } from '@todo/services';

const factory = new ApiClientFactory({ baseUrl: 'http://localhost:3003' });
const todoClient = factory.getTodoClient();
const authClient = factory.getAuthClient();
```

## Gateway base URL examples

| Environment | Gateway Base URL                          |
| ----------- | ----------------------------------------- |
| Development | `http://localhost:3003`                   |
| Staging     | `https://api-gateway.staging.example.com` |
| Production  | `https://api.example.com`                 |

## Using environment variables

```typescript
import { ApiClientFactory } from '@todo/services';

const baseUrl =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? process.env.EXPO_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:3003';

const factory = new ApiClientFactory({ baseUrl });
```

## Using `createForDevelopment` with the gateway port

```typescript
import { ApiClientFactory } from '@todo/services';

// Defaults to port 3001 (NestJS); pass 3003 for the API gateway
const factory = ApiClientFactory.createForDevelopment(3003);
const todoClient = factory.getTodoClient();
```

## Using `createForEnvironment`

```typescript
import { ApiClientFactory } from '@todo/services';

// Staging
const staging = ApiClientFactory.createForEnvironment('staging', 'https://api-gateway.staging.example.com');

// Production
const production = ApiClientFactory.createForEnvironment('production', 'https://api.example.com');

const todoClient = production.getTodoClient();
```
