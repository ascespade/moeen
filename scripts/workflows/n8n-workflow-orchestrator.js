#!/usr/bin/env node
// n8n-workflow-orchestrator.js
// n8n Workflow Management System with validation, health checks, and auto-fix
// Handles workflow validation, node linkage verification, and performance monitoring

let axios = require('axios');
let fs = require('fs').promises;
let path = require('path');
let winston = require('winston');
let cron = require('node-cron');
const { () => ({} as any) } = require('@supabase/supabase-js');
const v4: uuidv4 = require('uuid');

// Configure Winston logger
let logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/n8n-workflow.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Supabase client
let supabase = () => ({} as any)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class N8nWorkflowOrchestrator {
  constructor() {
    this.config = {
      n8nBaseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
      n8nApiKey: process.env.N8N_API_KEY,
      checkInterval: 300000, // 5 minutes
      maxRetries: 3,
      retryDelay: 5000,
      timeout: 30000
    };
    this.workflows = new Map();
    this.stats = {
      workflowsChecked: 0,
      workflowsFixed: 0,
      errors: 0,
      lastCheck: null,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0
    };
    this.isRunning = false;
    this.apiClient = axios.create({
      baseURL: this.config.n8nBaseUrl,
      timeout: this.config.timeout,
      headers: {
        'X-N8N-API-KEY': this.config.n8nApiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async start() {
    logger.info('🔄 Starting n8n Workflow Orchestrator...');
    this.isRunning = true;

    try {
      // Validate n8n connection
      await this.validateConnection();

      // Load existing workflows
      await this.loadWorkflows();

      // Schedule health checks
      this.scheduleHealthChecks();

      // Start workflow monitoring
      this.startWorkflowMonitoring();

      logger.info('✅ n8n Workflow Orchestrator started successfully');

      // Keep process alive
      process.on('SIGINT', () => this.shutdown());
      process.on('SIGTERM', () => this.shutdown());
    } catch (error) {
      logger.error('❌ Failed to start n8n Workflow Orchestrator:', error);
      process.exit(1);
    }
  }

  async validateConnection() {
    logger.info('🔗 Validating n8n connection...');

    try {
      let response = await this.apiClient.get('/api/v1/workflows');

      if (response.status === 200) {
        logger.info('✅ n8n connection validated successfully');
        return true;
      } else {
        throw new Error(`Unexpected status code: ${response.status}`
      }
    } catch (error) {
      logger.error('❌ Failed to validate n8n connection:', error.message);
      throw error;
    }
  }

  async loadWorkflows() {
    logger.info('📋 Loading workflows from n8n...');

    try {
      let response = await this.apiClient.get('/api/v1/workflows');
      let workflows = response.data.data || response.data;

      for (const workflow of workflows) {
        this.workflows.set(workflow.id, {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          nodes: workflow.nodes || [],
          connections: workflow.connections || {},
          createdAt: workflow.createdAt,
          updatedAt: workflow.updatedAt,
          lastExecuted: null,
          executionCount: 0,
          errorCount: 0,
          status: 'unknown'
        });
      }

      logger.info(`✅ Loaded ${this.workflows.size} workflows`
    } catch (error) {
      logger.error('❌ Failed to load workflows:', error);
      throw error;
    }
  }

  scheduleHealthChecks() {
    logger.info('⏰ Scheduling workflow health checks...');

    // Check workflows every 5 minutes
    cron.schedule('*/5 * * * *', async() => {
      logger.info('🏥 Starting workflow health check...');
      await this.performHealthCheck();
    });

    // Full validation every hour
    cron.schedule('0 * * * *', async() => {
      logger.info('🔍 Starting full workflow validation...');
      await this.performFullValidation();
    });

    // Performance analysis every 6 hours
    cron.schedule('0 */6 * * *', async() => {
      logger.info('📊 Starting performance analysis...');
      await this.performPerformanceAnalysis();
    });
  }

  async performHealthCheck() {
    this.stats.lastCheck = new Date();

    try {
      for (const [workflowId, workflow] of this.workflows) {
        await this.checkWorkflowHealth(workflowId, workflow);
      }

      await this.saveStatistics();
      logger.info('✅ Health check completed');
    } catch (error) {
      logger.error('❌ Health check failed:', error);
      this.stats.errors++;
    }
  }

  async checkWorkflowHealth(workflowId, workflow) {
    try {
      // Check if workflow is accessible
      let response = await this.apiClient.get(
        `/api/v1/workflows/${workflowId}`
      );

      if (response.status === 200) {
        workflow.status = 'healthy';

        // Check for deprecated nodes
        let deprecatedNodes = this.findDeprecatedNodes(workflow.nodes);
        if (deprecatedNodes.length > 0) {
          logger.warn(
            `⚠️ Workflow ${workflow.name} has deprecated nodes: ${deprecatedNodes.join(', ')}`
          );
          await this.fixDeprecatedNodes(workflowId, workflow, deprecatedNodes);
        }

        // Check node connections
        let connectionIssues = this.validateNodeConnections(workflow);
        if (connectionIssues.length > 0) {
          logger.warn(
            `⚠️ Workflow ${workflow.name} has connection issues: ${connectionIssues.join(', ')}`
          );
          await this.fixConnectionIssues(
            workflowId,
            workflow,
            connectionIssues
          );
        }
      } else {
        workflow.status = 'unhealthy';
        logger.error(
          `❌ Workflow ${workflow.name} is unhealthy (status: ${response.status})`
        );
      }
    } catch (error) {
      workflow.status = 'error';
      workflow.errorCount++;
      logger.error(`❌ Error checking workflow ${workflow.name}:`
    }
  }

  findDeprecatedNodes(nodes) {
    let deprecatedNodeTypes = [
      'n8n-nodes-base.deprecatedNode',
      'n8n-nodes-base.oldVersion',
      'n8n-nodes-base.legacyNode'
    ];

    return nodes
      .filter((node) => deprecatedNodeTypes.includes(node.type))
      .map((node) => node.name);
  }

  validateNodeConnections(workflow) {
    let issues = [];
    let nodes = workflow.nodes;
    let connections = workflow.connections;

    // Check if all nodes are connected
    let connectedNodes = new Set();
    Object.values(connections).forEach((connection) => {
      Object.values(connection).forEach((outputConnections) => {
        Object.values(outputConnections).forEach((inputConnections) => {
          inputConnections.forEach((input) => {
            connectedNodes.add(input.node);
          });
        });
      });
    });

    // Find isolated nodes
    nodes.forEach((node) => {
      if (
        !connectedNodes.has(node.name) &&
        node.type !== 'n8n-nodes-base.start'
      ) {
        issues.push(`Isolated node: ${node.name}`
      }
    });

    // Check for circular dependencies
    let circularDeps = this.findCircularDependencies(connections);
    issues.push(...circularDeps);

    return issues;
  }

  findCircularDependencies(connections) {
    let issues = [];
    let visited = new Set();
    let recursionStack = new Set();

    let dfs = (node) => {
      if (recursionStack.has(node)) {
        issues.push(`Circular dependency detected involving: ${node}`
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);

      // Check outgoing connections
      if (connections[node]) {
        Object.values(connections[node]).forEach((outputConnections) => {
          Object.values(outputConnections).forEach((inputConnections) => {
            inputConnections.forEach((input) => {
              dfs(input.node);
            });
          });
        });
      }

      recursionStack.delete(node);
    };

    Object.keys(connections).forEach((node) => {
      if (!visited.has(node)) {
        dfs(node);
      }
    });

    return issues;
  }

  async fixDeprecatedNodes(workflowId, workflow, deprecatedNodes) {
    logger.info(`🔧 Fixing deprecated nodes in workflow ${workflow.name}...`

    try {
      let updatedNodes = workflow.nodes.map((node) => {
        if (deprecatedNodes.includes(node.name)) {
          // Replace with modern equivalent
          return this.getModernNodeReplacement(node);
        }
        return node;
      });

      // Update workflow
      await this.apiClient.put(`/api/v1/workflows/${workflowId}`
        ...workflow,
        nodes: updatedNodes
      });

      this.stats.workflowsFixed++;
      logger.info(`✅ Fixed deprecated nodes in workflow ${workflow.name}`
    } catch (error) {
      logger.error(
        `❌ Failed to fix deprecated nodes in workflow ${workflow.name}:`
        error
      );
    }
  }

  getModernNodeReplacement(node) {
    let replacements = {
      'n8n-nodes-base.deprecatedNode': 'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.oldVersion': 'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.legacyNode': 'n8n-nodes-base.httpRequest'
    };

    return {
      ...node,
      type: replacements[node.type] || 'n8n-nodes-base.httpRequest',
      parameters: {
        ...node.parameters
        // Add any necessary parameter mappings
      }
    };
  }

  async fixConnectionIssues(workflowId, workflow, issues) {
    logger.info(`🔧 Fixing connection issues in workflow ${workflow.name}...`

    try {
      // For now, just log the issues and mark for manual review
      await this.logWorkflowIssues(workflowId, issues);

      // In a real implementation, you would implement specific fixes
      // based on the type of connection issue

      logger.info(`✅ Logged connection issues for workflow ${workflow.name}`
    } catch (error) {
      logger.error(
        `❌ Failed to fix connection issues in workflow ${workflow.name}:`
        error
      );
    }
  }

  async logWorkflowIssues(workflowId, issues) {
    try {
      await supabase.from('workflow_issues').insert({
        workflow_id: workflowId,
        issues: issues,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
    } catch (error) {
      logger.error('❌ Failed to log workflow issues:', error);
    }
  }

  async performFullValidation() {
    logger.info('🔍 Performing full workflow validation...');

    try {
      // Reload workflows
      await this.loadWorkflows();

      // Validate each workflow
      for (const [workflowId, workflow] of this.workflows) {
        await this.validateWorkflow(workflowId, workflow);
      }

      // Check for workflow performance issues
      await this.checkPerformanceIssues();

      logger.info('✅ Full validation completed');
    } catch (error) {
      logger.error('❌ Full validation failed:', error);
      this.stats.errors++;
    }
  }

  async validateWorkflow(workflowId, workflow) {
    try {
      // Validate workflow structure
      let validationResult = {
        workflowId,
        workflowName: workflow.name,
        isValid: true,
        issues: [],
        warnings: []
      };

      // Check for required nodes
      let hasStartNode = workflow.nodes.some(
        (node) =>
          node.type === 'n8n-nodes-base.start' ||
          node.type === 'n8n-nodes-base.manualTrigger'
      );

      if (!hasStartNode) {
        validationResult.issues.push('Missing start/trigger node');
        validationResult.isValid = false;
      }

      // Check for empty workflows
      if (workflow.nodes.length === 0) {
        validationResult.issues.push('Workflow has no nodes');
        validationResult.isValid = false;
      }

      // Check for duplicate node names
      let nodeNames = workflow.nodes.map((node) => node.name);
      let duplicateNames = nodeNames.filter(
        (name, index) => nodeNames.indexOf(name) !== index
      );

      if (duplicateNames.length > 0) {
        validationResult.issues.push(
          `Duplicate node names: ${duplicateNames.join(', ')}`
        );
        validationResult.isValid = false;
      }

      // Store validation result
      await this.storeValidationResult(validationResult);

      if (!validationResult.isValid) {
        logger.warn(
          `⚠️ Workflow ${workflow.name} validation failed: ${validationResult.issues.join(', ')}`
        );
      }
    } catch (error) {
      logger.error(`❌ Error validating workflow ${workflow.name}:`
    }
  }

  async checkPerformanceIssues() {
    logger.info('📊 Checking for performance issues...');

    try {
      // Get execution statistics
      let response = await this.apiClient.get('/api/v1/executions');
      let executions = response.data.data || response.data;

      // Analyze execution times
      let slowExecutions = executions.filter(
        (exec) =>
          exec.finishedAt &&
          exec.startedAt &&
          new Date(exec.finishedAt) - new Date(exec.startedAt) > 300000 // 5 minutes
      );

      if (slowExecutions.length > 0) {
        logger.warn(`⚠️ Found ${slowExecutions.length} slow executions`

        // Log performance issues
        await supabase.from('performance_issues').insert({
          type: 'slow_execution',
          count: slowExecutions.length,
          timestamp: new Date().toISOString(),
          details: slowExecutions.map((exec) => ({
            id: exec.id,
            workflowId: exec.workflowId,
            duration: new Date(exec.finishedAt) - new Date(exec.startedAt)
          }))
        });
      }
    } catch (error) {
      logger.error('❌ Error checking performance issues:', error);
    }
  }

  async performPerformanceAnalysis() {
    logger.info('📊 Performing performance analysis...');

    try {
      let analysis = {
        timestamp: new Date().toISOString(),
        totalWorkflows: this.workflows.size,
        activeWorkflows: Array.from(this.workflows.values()).filter(
          (w) => w.active
        ).length,
        totalExecutions: this.stats.totalExecutions,
        successRate:
          this.stats.totalExecutions > 0
            ? (this.stats.successfulExecutions / this.stats.totalExecutions) *
              100
            : 0,
        averageExecutionTime: 0, // Would be calculated from actual execution data
        issues: []
      };

      // Store analysis
      await supabase.from('performance_analysis').insert(analysis);

      logger.info(
        `📊 Performance analysis completed - Success rate: ${analysis.successRate.toFixed(2)}%`
      );
    } catch (error) {
      logger.error('❌ Performance analysis failed:', error);
    }
  }

  async simulateWorkflowExecution(workflowId) {
    logger.info(`🧪 Simulating execution for workflow ${workflowId}...`

    try {
      let response = await this.apiClient.post(
        `/api/v1/workflows/${workflowId}/execute`
        {
          data: {},
          mode: 'simulation'
        }
      );

      if (response.status === 200) {
        logger.info(`✅ Workflow ${workflowId} simulation successful`
        return true;
      } else {
        logger.error(
          `❌ Workflow ${workflowId} simulation failed: ${response.status}`
        );
        return false;
      }
    } catch (error) {
      logger.error(`❌ Workflow ${workflowId} simulation error:`
      return false;
    }
  }

  async storeValidationResult(result) {
    try {
      await supabase.from('workflow_validation').upsert(
        {
          workflow_id: result.workflowId,
          workflow_name: result.workflowName,
          is_valid: result.isValid,
          issues: result.issues,
          warnings: result.warnings,
          timestamp: new Date().toISOString()
        },
        { onConflict: 'workflow_id' }
      );
    } catch (error) {
      logger.error('❌ Failed to store validation result:', error);
    }
  }

  async saveStatistics() {
    try {
      let statsData = {
        ...this.stats,
        timestamp: new Date().toISOString(),
        workflowCount: this.workflows.size
      };

      await fs.writeFile(
        './logs/n8n-stats.json',
        JSON.stringify(statsData, null, 2)
      );

      // Store in Supabase
      await supabase.from('system_metrics').insert({
        service_name: 'n8n-orchestrator',
        metrics: statsData,
        timestamp: new Date().toISOString()
      });

      logger.info('📊 Statistics saved');
    } catch (error) {
      logger.error('❌ Failed to save statistics:', error);
    }
  }

  startWorkflowMonitoring() {
    logger.info('👁️ Starting workflow monitoring...');

    // Monitor workflow executions
    setInterval(async() => {
      try {
        await this.monitorWorkflowExecutions();
      } catch (error) {
        logger.error('❌ Workflow monitoring error:', error);
      }
    }, 60000); // Every minute
  }

  async monitorWorkflowExecutions() {
    try {
      let response = await this.apiClient.get('/api/v1/executions?limit=10');
      let executions = response.data.data || response.data;

      for (const execution of executions) {
        this.stats.totalExecutions++;

        if (execution.finishedAt) {
          if (execution.status === 'success') {
            this.stats.successfulExecutions++;
          } else {
            this.stats.failedExecutions++;
          }
        }
      }
    } catch (error) {
      logger.error('❌ Error monitoring workflow executions:', error);
    }
  }

  async shutdown() {
    logger.info('🛑 Shutting down n8n Workflow Orchestrator...');
    this.isRunning = false;

    // Save final statistics
    await this.saveStatistics();

    logger.info('✅ n8n Workflow Orchestrator shutdown complete');
    process.exit(0);
  }

  // Public API
  getStats() {
    return {
      ...this.stats,
      workflowCount: this.workflows.size,
      isRunning: this.isRunning
    };
  }

  async forceValidation() {
    logger.info('🔍 Force validation requested...');
    await this.performFullValidation();
  }

  async simulateAllWorkflows() {
    logger.info('🧪 Simulating all workflows...');

    for (const [workflowId, workflow] of this.workflows) {
      if (workflow.active) {
        await this.simulateWorkflowExecution(workflowId);
      }
    }
  }
}

// Start the orchestrator if this file is run directly
if (require.main === module) {
  let orchestrator = new N8nWorkflowOrchestrator();
  orchestrator.start().catch((error) => {
    logger.error('❌ Failed to start orchestrator:', error);
    process.exit(1);
  });
}

module.exports = N8nWorkflowOrchestrator;
