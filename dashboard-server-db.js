#!/usr/bin/env node

/**
 * Enhanced Dashboard Server with Database Support
 * Serves the progress dashboard with real-time database metrics
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const PORT = 3001;
const HOST = '0.0.0.0';

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

// Database configuration
const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

console.log('📦 Database Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER?.substring(0, 10) + '...',
  hasPassword: !!process.env.DB_PASSWORD
});

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

// Database helper
async function queryDatabase(query, params = []) {
  const client = new Client(DB_CONFIG);
  try {
    await client.connect();
    const result = await client.query(query, params);
    return { success: true, data: result.rows, rowCount: result.rowCount };
  } catch (error) {
    console.error('Database query error:', error.message);
    return { success: false, error: error.message };
  } finally {
    await client.end();
  }
}

// Route handlers
async function handleHealth(req, res) {
  const startTime = Date.now();
  
  // Test database connection
  const dbTest = await queryDatabase('SELECT NOW() as current_time');
  const responseTime = Date.now() - startTime;
  
  const health = {
    status: dbTest.success ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    server: 'dashboard-server-db',
    database: dbTest.success ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    responseTime,
    memory: process.memoryUsage()
  };
  
  res.writeHead(dbTest.success ? 200 : 500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(health, null, 2));
}

async function handleMetrics(req, res) {
  try {
    // Get basic system metrics
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      database: {
        connected: false,
        patients: 0,
        appointments: 0,
        users: 0,
        doctors: 0
      },
      monitor: {
        active: fs.existsSync(path.join(__dirname, 'system-status.json')),
        statusFile: 'system-status.json'
      }
    };

    // Try to get database metrics
    const tables = ['patients', 'appointments', 'users', 'doctors'];
    const dbMetrics = {};
    
    for (const table of tables) {
      const result = await queryDatabase(`SELECT COUNT(*) as count FROM ${table}`);
      if (result.success && result.data.length > 0) {
        dbMetrics[table] = parseInt(result.data[0].count);
        metrics.database.connected = true;
      }
    }
    
    metrics.database = { ...metrics.database, ...dbMetrics };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error('Metrics error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}

async function handleDashboardMetrics(req, res) {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        health: [],
        metrics: []
      },
      automation: {
        socialMedia: { totalPosts: 0, platforms: {}, engagement: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0 } },
        workflows: { totalWorkflows: 0, validWorkflows: 0, invalidWorkflows: 0, commonIssues: {} },
        chatbot: { activeFlows: 0, totalNodes: 0, totalTemplates: 0, languages: [], categories: [] }
      },
      healthcare: {
        patients: { total: 0, active: 0, newThisMonth: 0, growthRate: 0 },
        appointments: { total: 0, today: 0, thisWeek: 0, completed: 0, cancelled: 0 },
        doctors: { total: 0, active: 0, specialties: [] },
        revenue: { thisMonth: 0, lastMonth: 0, growthRate: 0, averagePerPatient: 0 }
      },
      summary: {
        overallHealth: "good",
        activeServices: 1,
        totalAutomation: 0,
        errorRate: 0
      }
    };

    // Get patients count
    const patientsResult = await queryDatabase('SELECT COUNT(*) as count FROM patients');
    if (patientsResult.success) {
      metrics.healthcare.patients.total = parseInt(patientsResult.data[0].count);
      
      // Get active patients
      const activePatientsResult = await queryDatabase("SELECT COUNT(*) as count FROM patients WHERE status = 'active'");
      if (activePatientsResult.success) {
        metrics.healthcare.patients.active = parseInt(activePatientsResult.data[0].count);
      }
      
      // Get new patients this month
      const newPatientsResult = await queryDatabase("SELECT COUNT(*) as count FROM patients WHERE created_at >= date_trunc('month', CURRENT_DATE)");
      if (newPatientsResult.success) {
        metrics.healthcare.patients.newThisMonth = parseInt(newPatientsResult.data[0].count);
      }
    }

    // Get appointments count
    const appointmentsResult = await queryDatabase('SELECT COUNT(*) as count FROM appointments');
    if (appointmentsResult.success) {
      metrics.healthcare.appointments.total = parseInt(appointmentsResult.data[0].count);
      
      // Get today's appointments
      const todayResult = await queryDatabase("SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE");
      if (todayResult.success) {
        metrics.healthcare.appointments.today = parseInt(todayResult.data[0].count);
      }
      
      // Get this week's appointments
      const weekResult = await queryDatabase("SELECT COUNT(*) as count FROM appointments WHERE appointment_date >= date_trunc('week', CURRENT_DATE)");
      if (weekResult.success) {
        metrics.healthcare.appointments.thisWeek = parseInt(weekResult.data[0].count);
      }
    }

    // Get doctors count
    const doctorsResult = await queryDatabase('SELECT COUNT(*) as count FROM doctors');
    if (doctorsResult.success) {
      metrics.healthcare.doctors.total = parseInt(doctorsResult.data[0].count);
      
      // Get specialties
      const specialtiesResult = await queryDatabase("SELECT specialty, COUNT(*) as count FROM doctors GROUP BY specialty");
      if (specialtiesResult.success) {
        metrics.healthcare.doctors.specialties = specialtiesResult.data.map(row => ({
          name: row.specialty || 'غير محدد',
          count: parseInt(row.count)
        }));
      }
    }

    // Update summary
    metrics.summary.activeServices = patientsResult.success && appointmentsResult.success && doctorsResult.success ? 3 : 1;
    metrics.summary.overallHealth = metrics.summary.activeServices >= 2 ? "good" : "fair";

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString(),
      fallback: true
    }));
  }
}

const server = http.createServer(async (req, res) => {
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
    const statusPath = path.join(__dirname, 'system-status.json');
    fs.readFile(statusPath, (err, data) => {
      if (err) {
        const defaultStatus = {
          timestamp: new Date().toISOString(),
          status: 'monitoring',
          isMonitoring: true,
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
    await handleHealth(req, res);
  } else if (req.url === '/api/metrics') {
    await handleMetrics(req, res);
  } else if (req.url === '/api/dashboard/metrics') {
    await handleDashboardMetrics(req, res);
  } else if (req.url === '/api/dashboard/health') {
    await handleHealth(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🚀 Enhanced Dashboard Server Started!                    ║
║                                                            ║
║  📊 Dashboard URL: http://localhost:${PORT}                ║
║  🌐 Network URL:   http://${HOST}:${PORT}                      ║
║                                                            ║
║  📝 Endpoints:                                             ║
║     GET  /                        - Dashboard              ║
║     GET  /dashboard               - Dashboard              ║
║     GET  /api/health              - Health Check           ║
║     GET  /api/metrics             - System Metrics         ║
║     GET  /api/dashboard/metrics   - Dashboard Metrics      ║
║     GET  /api/dashboard/health    - Dashboard Health       ║
║     GET  /system-status.json      - Monitor Status         ║
║                                                            ║
║  🗄️  Database: ${DB_CONFIG.connectionString ? 'Configured' : 'Not configured'}                           ║
║  ⚡ Server is ready with database support!                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  // Test database connection on startup
  queryDatabase('SELECT NOW() as current_time').then(result => {
    if (result.success) {
      console.log('✅ Database connection successful!');
      console.log('📅 Database time:', result.data[0].current_time);
    } else {
      console.log('⚠️  Database connection failed:', result.error);
      console.log('📝 Server will run with limited functionality');
    }
  });
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
    console.error('   Trying to kill existing process...');
    require('child_process').exec(`pkill -f "node.*dashboard-server"`, () => {
      console.error('   Please restart the server');
      process.exit(1);
    });
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

module.exports = server;

