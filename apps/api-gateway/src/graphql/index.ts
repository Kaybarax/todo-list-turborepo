import { Elysia } from 'elysia';
import { createSchema, createYoga } from 'graphql-yoga';

import { resolvers } from './resolvers';
import { typeDefs } from './schema';
import { config } from '../config/env';

export function createGraphQLRoute(): Elysia {
  if (!config.graphql.enabled) {
    return new Elysia();
  }

  const yoga = createYoga({
    schema: createSchema({ typeDefs, resolvers }),
  });

  return new Elysia().all(config.graphql.path, ({ request }) => yoga.fetch(request));
}
