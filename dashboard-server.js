#!/usr/bin/env node

/**
 * Standalone Progress Dashboard Server
 * Serves the progress dashboard without requiring database access
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const HOST = '0.0.0.0';

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route handling
  if (req.url === '/' || req.url === '/dashboard') {
    // Serve the progress dashboard
    const dashboardPath = path.join(__dirname, 'progress-dashboard.html');
    fs.readFile(dashboardPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading dashboard');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/system-status.json') {
    // Serve the system status
    const statusPath = path.join(__dirname, 'system-status.json');
    fs.readFile(statusPath, (err, data) => {
      if (err) {
        // Return default status if file doesn't exist
        const defaultStatus = {
          timestamp: new Date().toISOString(),
          status: 'unknown',
          isMonitoring: false,
          lastCheck: new Date().toISOString()
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(defaultStatus));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (req.url === '/api/health') {
    // Health check endpoint
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'dashboard-server',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health));
  } else if (req.url === '/api/metrics') {
    // Simple metrics endpoint that doesn't require database
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      monitor: {
        active: fs.existsSync(path.join(__dirname, 'system-status.json')),
        statusFile: 'system-status.json'
      }
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics));
  } else {
    // Try to serve static file
    const filePath = path.join(__dirname, req.url);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🚀 Progress Dashboard Server Started!                    ║
║                                                            ║
║  📊 Dashboard URL: http://localhost:${PORT}                ║
║  🌐 Network URL:   http://${HOST}:${PORT}                      ║
║                                                            ║
║  📝 Endpoints:                                             ║
║     GET  /              - Dashboard                        ║
║     GET  /dashboard     - Dashboard                        ║
║     GET  /api/health    - Health Check                     ║
║     GET  /api/metrics   - System Metrics                   ║
║     GET  /system-status.json - Monitor Status              ║
║                                                            ║
║  ⚡ Server is ready to serve the dashboard!               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down dashboard server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down dashboard server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use`);
    console.error('   Try: pkill -f "node.*dashboard-server"');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

module.exports = server;

