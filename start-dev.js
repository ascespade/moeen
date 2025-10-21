import { spawn } from 'child_process';
import net from 'net';

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find available port starting from 3000
async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port <= startPort + 100; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('No available ports found');
}

// Function to start Next.js dev server
async function startDevServer() {
  try {
    console.log('🔍 Searching for available port...');
    
    const port = await findAvailablePort(3000);
    console.log(`✅ Found available port: ${port}`);
    
    console.log(`🚀 Starting Next.js development server on port ${port}...`);
    console.log(`📱 Open your browser and go to: http://localhost:${port}`);
    
    // Start Next.js dev server
    const child = spawn('npm', ['run', 'dev', '--', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development server...');
      child.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down development server...');
      child.kill('SIGTERM');
      process.exit(0);
    });
    
    child.on('error', (error) => {
      console.error('❌ Error starting development server:', error);
      process.exit(1);
    });
    
    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Development server exited with code ${code}`);
        process.exit(code);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Start the development server
startDevServer();
