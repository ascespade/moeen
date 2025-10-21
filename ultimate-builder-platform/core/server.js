#!/usr/bin/env node

/**
 * 🚀 Ultimate Builder Platform - Server Core
 * منصة البناء الذكية المتقدمة - الخادم الرئيسي
 *
 * الميزات:
 * - دعم حتى 256 أجنت متوازي
 * - واجهة ويب احترافية
 * - مراقبة فورية
 * - إدارة المشاريع
 * - تكامل Git
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn, fork } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import cluster from 'cluster';
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import figlet from 'figlet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UltimateBuilderPlatform {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.port = process.env.PORT || 3000;
    this.maxAgents = 256;
    this.activeAgents = new Map();
    this.projects = new Map();
    this.isDev = process.argv.includes('--dev');

    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketIO();
    this.setupAgentManager();
  }

  async init() {
    console.clear();

    // Show banner
    const banner = figlet.textSync('Ultimate Builder', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });

    console.log(gradient.rainbow(banner));

    const info = boxen(
      `🚀 Ultimate Builder Platform v1.0.0
      
🧠 AI-Powered Development Platform
⚡ Parallel Agent Processing (up to 256 agents)
🌐 Professional Web Interface
📊 Real-time Monitoring
🔧 Git Integration
🎨 Visual Builder Interface

${chalk.green('✓')} Server starting on port ${this.port}
${chalk.green('✓')} Web interface: http://localhost:${this.port}
${chalk.green('✓')} API endpoint: http://localhost:${this.port}/api
${chalk.green('✓')} Max agents: ${this.maxAgents}
${chalk.green('✓')} CPU cores: ${os.cpus().length}
${chalk.green('✓')} Memory: ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB

${chalk.yellow('Press Ctrl+C to stop the server')}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
      }
    );

    console.log(info);

    // Ensure directories exist
    await this.ensureDirectories();

    // Load existing projects
    await this.loadProjects();

    // Start server
    this.server.listen(this.port, () => {
      console.log(
        chalk.green(`\n🚀 Ultimate Builder Platform started successfully!`)
      );
      console.log(
        chalk.cyan(`📱 Web Interface: http://localhost:${this.port}`)
      );
      console.log(
        chalk.cyan(`🔌 API Endpoint: http://localhost:${this.port}/api`)
      );
      console.log(
        chalk.cyan(`📊 Monitor: http://localhost:${this.port}/monitor`)
      );
    });
  }

  setupMiddleware() {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    this.app.use(express.static(path.join(__dirname, 'web-interface/dist')));

    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
  }

  setupRoutes() {
    // API Routes
    this.app.get('/api/status', (req, res) => {
      res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        activeAgents: this.activeAgents.size,
        maxAgents: this.maxAgents,
        projects: this.projects.size,
        system: {
          cpu: os.cpus().length,
          memory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
          platform: os.platform(),
          uptime: process.uptime(),
        },
      });
    });

    this.app.get('/api/agents', (req, res) => {
      const agents = Array.from(this.activeAgents.values()).map(agent => ({
        id: agent.id,
        type: agent.type,
        status: agent.status,
        project: agent.project,
        startTime: agent.startTime,
        progress: agent.progress,
        logs: agent.logs.slice(-10), // Last 10 logs
      }));
      res.json(agents);
    });

    this.app.get('/api/projects', (req, res) => {
      const projects = Array.from(this.projects.values()).map(project => ({
        id: project.id,
        name: project.name,
        path: project.path,
        type: project.type,
        status: project.status,
        lastModified: project.lastModified,
        agents: project.agents,
      }));
      res.json(projects);
    });

    this.app.post('/api/projects', async (req, res) => {
      try {
        const { name, path, type } = req.body;
        const project = await this.addProject(name, path, type);
        res.json(project);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/agents/start', async (req, res) => {
      try {
        const { type, projectId, config } = req.body;
        const agent = await this.startAgent(type, projectId, config);
        res.json(agent);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/agents/stop', async (req, res) => {
      try {
        const { agentId } = req.body;
        await this.stopAgent(agentId);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Serve web interface
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'web-interface/dist/index.html'));
    });
  }

  setupSocketIO() {
    this.io.on('connection', socket => {
      console.log(chalk.blue(`📱 Client connected: ${socket.id}`));

      socket.on('join-project', projectId => {
        socket.join(`project-${projectId}`);
        console.log(
          chalk.blue(`📱 Client ${socket.id} joined project ${projectId}`)
        );
      });

      socket.on('agent-command', async data => {
        try {
          const { agentId, command, params } = data;
          const agent = this.activeAgents.get(agentId);

          if (agent) {
            agent.process.send({ command, params });
            socket.emit('agent-response', { agentId, status: 'command-sent' });
          }
        } catch (error) {
          socket.emit('agent-error', { error: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log(chalk.red(`📱 Client disconnected: ${socket.id}`));
      });
    });
  }

  setupAgentManager() {
    // Monitor agent processes
    setInterval(() => {
      this.activeAgents.forEach((agent, id) => {
        if (agent.process.killed) {
          this.activeAgents.delete(id);
          this.io.emit('agent-stopped', { agentId: id });
        }
      });
    }, 1000);
  }

  async ensureDirectories() {
    const dirs = ['projects', 'logs', 'temp', 'backups', 'web-interface/dist'];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(__dirname, dir));
    }
  }

  async loadProjects() {
    try {
      const projectsDir = path.join(__dirname, 'projects');
      const projectFiles = await fs.readdir(projectsDir);

      for (const file of projectFiles) {
        if (file.endsWith('.json')) {
          const projectData = await fs.readJson(path.join(projectsDir, file));
          this.projects.set(projectData.id, projectData);
        }
      }

      console.log(chalk.green(`✓ Loaded ${this.projects.size} projects`));
    } catch (error) {
      console.log(chalk.yellow(`⚠ No projects found`));
    }
  }

  async addProject(name, projectPath, type = 'web') {
    const projectId = `project-${Date.now()}`;
    const project = {
      id: projectId,
      name,
      path: projectPath,
      type,
      status: 'active',
      lastModified: new Date().toISOString(),
      agents: [],
    };

    this.projects.set(projectId, project);

    // Save to file
    await fs.writeJson(
      path.join(__dirname, 'projects', `${projectId}.json`),
      project,
      { spaces: 2 }
    );

    this.io.emit('project-added', project);
    return project;
  }

  async startAgent(type, projectId, config = {}) {
    if (this.activeAgents.size >= this.maxAgents) {
      throw new Error(`Maximum agents limit reached (${this.maxAgents})`);
    }

    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const agentId = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const agentPath = path.join(__dirname, 'agents', type, 'index.mjs');

    // Check if agent exists
    if (!(await fs.pathExists(agentPath))) {
      throw new Error(`Agent type '${type}' not found`);
    }

    const agentProcess = fork(agentPath, [], {
      cwd: project.path,
      env: {
        ...process.env,
        PROJECT_PATH: project.path,
        PROJECT_ID: projectId,
        AGENT_ID: agentId,
        AGENT_CONFIG: JSON.stringify(config),
      },
    });

    const agent = {
      id: agentId,
      type,
      project: projectId,
      process: agentProcess,
      status: 'starting',
      startTime: new Date().toISOString(),
      progress: 0,
      logs: [],
    };

    this.activeAgents.set(agentId, agent);
    project.agents.push(agentId);

    // Handle agent communication
    agentProcess.on('message', message => {
      if (message.type === 'log') {
        agent.logs.push({
          timestamp: new Date().toISOString(),
          level: message.level,
          message: message.message,
        });

        this.io.to(`project-${projectId}`).emit('agent-log', {
          agentId,
          log: message,
        });
      } else if (message.type === 'progress') {
        agent.progress = message.progress;
        agent.status = message.status;

        this.io.to(`project-${projectId}`).emit('agent-progress', {
          agentId,
          progress: message.progress,
          status: message.status,
        });
      } else if (message.type === 'complete') {
        agent.status = 'completed';
        agent.progress = 100;

        this.io.to(`project-${projectId}`).emit('agent-complete', {
          agentId,
          result: message.result,
        });
      }
    });

    agentProcess.on('error', error => {
      agent.status = 'error';
      agent.logs.push({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: error.message,
      });

      this.io.to(`project-${projectId}`).emit('agent-error', {
        agentId,
        error: error.message,
      });
    });

    agentProcess.on('exit', code => {
      agent.status = code === 0 ? 'completed' : 'failed';
      this.activeAgents.delete(agentId);

      this.io.to(`project-${projectId}`).emit('agent-exit', {
        agentId,
        code,
      });
    });

    this.io.emit('agent-started', agent);
    return agent;
  }

  async stopAgent(agentId) {
    const agent = this.activeAgents.get(agentId);
    if (agent) {
      agent.process.kill();
      this.activeAgents.delete(agentId);

      const project = this.projects.get(agent.project);
      if (project) {
        project.agents = project.agents.filter(id => id !== agentId);
      }

      this.io.emit('agent-stopped', { agentId });
    }
  }

  async shutdown() {
    console.log(
      chalk.yellow('\n🛑 Shutting down Ultimate Builder Platform...')
    );

    // Stop all agents
    for (const [agentId, agent] of this.activeAgents) {
      agent.process.kill();
    }

    // Close server
    this.server.close(() => {
      console.log(chalk.green('✓ Server closed'));
      process.exit(0);
    });
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await platform.shutdown();
});

process.on('SIGTERM', async () => {
  await platform.shutdown();
});

// Start the platform
const platform = new UltimateBuilderPlatform();
platform.init().catch(console.error);
