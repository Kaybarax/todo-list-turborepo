import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

process.env.JWT_SECRET ??= 'openapi-export-secret';
process.env.CORS_ORIGIN ??= 'http://localhost:3000';

async function exportOpenAPI() {
  console.log('Exporting OpenAPI spec...');

  const { app } = await import('../src/app');
  const response = await app.handle(new Request('http://localhost/api/docs/json'));

  if (!response.ok) {
    console.error('Failed to fetch OpenAPI spec', await response.text());
    process.exit(1);
  }

  const spec = await response.json();
  const outputPath = resolve(__dirname, '../../../docs/api/openapi/gateway-current.openapi.json');

  mkdirSync(resolve(outputPath, '..'), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(spec, null, 2)}\n`);
  console.log(`OpenAPI spec exported to: ${outputPath}`);
}

exportOpenAPI().catch(err => {
  console.error(err);
  process.exit(1);
});
