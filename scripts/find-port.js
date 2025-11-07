/**
 * Start Next.js Dev Server with Dynamic Port
 * بدء خادم Next.js التطويري مع منفذ ديناميكي
 * 
 * Finds an available port automatically and starts Next.js
 * يتجاهل رسائل الخطأ EADDRINUSE ويعثر على منفذ متاح تلقائياً
 */

import { spawn } from 'child_process';
import { createServer } from 'net';

/**
 * Find an available port starting from basePort
 */
function findAvailablePort(basePort = 3000, maxAttempts = 100) {
  return new Promise((resolve, reject) => {
    const currentPort = basePort;
    let attempts = 0;

    const tryPort = (port) => {
      if (attempts >= maxAttempts) {
        reject(new Error(`Could not find available port after ${maxAttempts} attempts`));
        return;
      }

      const server = createServer();
      
      server.listen(port, '127.0.0.1', () => {
        server.once('close', () => {
          resolve(port);
        });
        server.close();
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          attempts++;
          tryPort(port + 1);
        } else {
          reject(err);
        }
      });
    };

    tryPort(currentPort);
  });
}

/**
 * Filter out EADDRINUSE error messages from output
 */
function filterEADDRINUSE(chunk) {
  const lines = chunk.toString().split('\n');
  return lines
    .filter(line => {
      // Filter out EADDRINUSE errors
      if (line.includes('EADDRINUSE') || 
          line.includes('errno: -98') ||
          line.includes('address:') && line.includes('port:')) {
        return false;
      }
      return true;
    })
    .join('\n');
}

// Main execution
async function startDevServer() {
  try {
    const basePort = parseInt(process.env.PORT || process.argv[2] || '3000', 10);
    const port = await findAvailablePort(basePort);
    
    console.log(`🚀 Starting Next.js dev server on port ${port}...`);
    
    // Start Next.js with the found port
    const nextProcess = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      shell: true,
      env: {
        ...process.env,
        PORT: port.toString(),
      },
    });

    // Filter stderr to hide EADDRINUSE messages
    nextProcess.stderr.on('data', (chunk) => {
      const filtered = filterEADDRINUSE(chunk);
      if (filtered.trim()) {
        process.stderr.write(filtered);
      }
    });

    // Pass through stdout
    nextProcess.stdout.on('data', (chunk) => {
      const filtered = filterEADDRINUSE(chunk);
      if (filtered.trim()) {
        process.stdout.write(filtered);
      }
    });

    // Handle process exit
    nextProcess.on('exit', (code) => {
      process.exit(code || 0);
    });

    // Handle errors (but ignore EADDRINUSE silently)
    nextProcess.on('error', (err) => {
      if (err.code !== 'EADDRINUSE') {
        console.error('Error starting server:', err.message);
        process.exit(1);
      }
      // Silently ignore EADDRINUSE - try next port
      setTimeout(async () => {
        try {
          const newPort = await findAvailablePort(port + 1);
          console.log(`🔄 Retrying on port ${newPort}...`);
          startDevServer();
        } catch {
          process.exit(1);
        }
      }, 100);
    });

    // Handle signals
    process.on('SIGINT', () => {
      nextProcess.kill('SIGINT');
    });
    process.on('SIGTERM', () => {
      nextProcess.kill('SIGTERM');
    });

  } catch (err) {
    // If port finding fails, try default port
    console.log(`⚠️  Port ${process.env.PORT || process.argv[2] || '3000'} unavailable, trying next available port...`);
    
    try {
      const newPort = await findAvailablePort(parseInt(process.env.PORT || process.argv[2] || '3000', 10) + 1);
      console.log(`🚀 Starting Next.js dev server on port ${newPort}...`);
      
      const nextProcess = spawn('npx', ['next', 'dev', '-p', newPort.toString()], {
        shell: true,
        env: {
          ...process.env,
          PORT: newPort.toString(),
        },
      });

      nextProcess.stderr.on('data', (chunk) => {
        const filtered = filterEADDRINUSE(chunk);
        if (filtered.trim()) {
          process.stderr.write(filtered);
        }
      });

      nextProcess.stdout.on('data', (chunk) => {
        const filtered = filterEADDRINUSE(chunk);
        if (filtered.trim()) {
          process.stdout.write(filtered);
        }
      });

      nextProcess.on('exit', (code) => {
        process.exit(code || 0);
      });

      nextProcess.on('error', (err) => {
        if (err.code !== 'EADDRINUSE') {
          console.error('Error starting server:', err.message);
          process.exit(1);
        }
      });
    } catch (finalErr) {
      console.error('Failed to start server:', finalErr.message);
      process.exit(1);
    }
  }
}

startDevServer();
