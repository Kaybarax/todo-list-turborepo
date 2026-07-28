#!/usr/bin/env node

/**
 * Minimal static file server for Storybook build output.
 * Used by Playwright webServer config in CI.
 * Zero external dependencies — uses only Node.js built-in modules.
 *
 * Usage: node scripts/serve-storybook.mjs [port] [directory]
 *   port:      default 6006
 *   directory: default storybook-static (relative to package root)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');

const PORT = parseInt(process.argv[2] || '6006', 10);
const STATIC_DIR = path.resolve(packageRoot, process.argv[3] || 'storybook-static');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(STATIC_DIR, req.url === '/' ? 'index.html' : req.url);

  // Security: prevent directory traversal outside STATIC_DIR
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try index.html for SPA-style routes
      const indexPath = path.join(STATIC_DIR, 'index.html');
      fs.readFile(indexPath, (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = path.extname(indexPath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Storybook static server listening on http://127.0.0.1:${PORT}`);
  console.log(`Serving directory: ${STATIC_DIR}`);
});
