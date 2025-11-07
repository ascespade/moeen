#!/usr/bin/env node

/**
 * Find Available Port
 * ????? ?? ???? ???? ????????
 */

import { createServer } from 'net';

/**
 * Find an available port starting from the given port
 * ????? ?? ???? ???? ????? ?? ?????? ??????
 */
export function findAvailablePort(startPort = 3000, maxAttempts = 100) {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let attempts = 0;

    const tryPort = port => {
      if (attempts >= maxAttempts) {
        reject(
          new Error(
            `Could not find available port after ${maxAttempts} attempts`
          )
        );
        return;
      }

      const server = createServer();

      server.listen(port, () => {
        server.once('close', () => {
          resolve(port);
        });
        server.close();
      });

      server.on('error', err => {
        if (err.code === 'EADDRINUSE') {
          attempts++;
          currentPort++;
          tryPort(currentPort);
        } else {
          reject(err);
        }
      });
    };

    tryPort(currentPort);
  });
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  findAvailablePort(process.env.PORT ? parseInt(process.env.PORT) : 3000)
    .then(port => {
      console.log(port);
      process.exit(0);
    })
    .catch(err => {
      console.error(err.message);
      process.exit(1);
    });
}
