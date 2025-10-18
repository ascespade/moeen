#!/usr/bin/env node

/**
 * Cursor Background Agent Integration
 * Handles communication with Cursor Background Agent API for CI self-healing
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class CursorAgentIntegration {
  constructor(apiKey, baseUrl = 'https://api.cursor.sh/v1/background-agent') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeout = 30000; // 30 seconds
  }

  async sendErrorReport(errorData) {
    const {
      errorType,
      file,
      line,
      message,
      context,
      priority = 'medium',
      workflowRunId,
      branch,
      commit
    } = errorData;

    const payload = {
      type: 'ci_error_report',
      data: {
        error_type: errorType,
        file: file,
        line: line,
        message: message,
        context: context,
        priority: priority,
        workflow_run_id: workflowRunId,
        branch: branch,
        commit: commit,
        timestamp: new Date().toISOString(),
        source: 'ci_self_healing'
      }
    };

    return this.makeRequest('/error-report', payload);
  }

  async requestFix(fixData) {
    const {
      errorHash,
      errorType,
      context,
      previousAttempts = [],
      confidence = 0.0
    } = fixData;

    const payload = {
      type: 'ci_fix_request',
      data: {
        error_hash: errorHash,
        error_type: errorType,
        context: context,
        previous_attempts: previousAttempts,
        confidence: confidence,
        timestamp: new Date().toISOString(),
        source: 'ci_self_healing'
      }
    };

    return this.makeRequest('/fix-request', payload);
  }

  async sendLearningData(learningData) {
    const {
      sessionId,
      errorsAnalyzed,
      fixesApplied,
      successRate,
      insights,
      patterns
    } = learningData;

    const payload = {
      type: 'ci_learning_data',
      data: {
        session_id: sessionId,
        errors_analyzed: errorsAnalyzed,
        fixes_applied: fixesApplied,
        success_rate: successRate,
        insights: insights,
        patterns: patterns,
        timestamp: new Date().toISOString(),
        source: 'ci_self_healing'
      }
    };

    return this.makeRequest('/learning-data', payload);
  }

  async requestOptimization(optimizationData) {
    const {
      workflow,
      performanceMetrics,
      bottlenecks,
      suggestions
    } = optimizationData;

    const payload = {
      type: 'ci_optimization_request',
      data: {
        workflow: workflow,
        performance_metrics: performanceMetrics,
        bottlenecks: bottlenecks,
        suggestions: suggestions,
        timestamp: new Date().toISOString(),
        source: 'ci_self_healing'
      }
    };

    return this.makeRequest('/optimization-request', payload);
  }

  async makeRequest(endpoint, payload) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(payload);
      
      const options = {
        hostname: 'api.cursor.sh',
        port: 443,
        path: '/v1/background-agent' + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'CI-Self-Healing/1.0'
        },
        timeout: this.timeout
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
            } else {
              reject(new Error(`API Error: ${res.statusCode} - ${response.message || data}`));
            }
          } catch (error) {
            reject(new Error(`Invalid JSON response: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  async testConnection() {
    try {
      const response = await this.makeRequest('/health', { type: 'ping' });
      console.log('✅ Cursor Agent connection successful');
      return true;
    } catch (error) {
      console.error('❌ Cursor Agent connection failed:', error.message);
      return false;
    }
  }

  async getFixSuggestions(errorType, context) {
    try {
      const response = await this.makeRequest('/suggestions', {
        type: 'fix_suggestions',
        data: {
          error_type: errorType,
          context: context,
          timestamp: new Date().toISOString()
        }
      });
      
      return response.suggestions || [];
    } catch (error) {
      console.error('❌ Error getting fix suggestions:', error.message);
      return [];
    }
  }

  async validateFix(fixData) {
    try {
      const response = await this.makeRequest('/validate-fix', {
        type: 'fix_validation',
        data: {
          fix_data: fixData,
          timestamp: new Date().toISOString()
        }
      });
      
      return response.validation || { valid: false, issues: [] };
    } catch (error) {
      console.error('❌ Error validating fix:', error.message);
      return { valid: false, issues: ['Validation service unavailable'] };
    }
  }

  async getWorkflowOptimizations(workflowData) {
    try {
      const response = await this.makeRequest('/workflow-optimization', {
        type: 'workflow_optimization',
        data: {
          workflow: workflowData,
          timestamp: new Date().toISOString()
        }
      });
      
      return response.optimizations || [];
    } catch (error) {
      console.error('❌ Error getting workflow optimizations:', error.message);
      return [];
    }
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const apiKey = process.env.CURSOR_API_KEY || process.argv[3];

  if (!apiKey) {
    console.error('❌ CURSOR_API_KEY environment variable or API key argument required');
    process.exit(1);
  }

  const agent = new CursorAgentIntegration(apiKey);

  async function main() {
    switch (command) {
      case 'test':
        await agent.testConnection();
        break;
        
      case 'suggest':
        const errorType = process.argv[3] || 'yaml_syntax_error';
        const context = process.argv[4] || 'GitHub Actions workflow';
        const suggestions = await agent.getFixSuggestions(errorType, context);
        console.log(JSON.stringify(suggestions, null, 2));
        break;
        
      case 'validate':
        const fixData = {
          type: 'yaml_fix',
          changes: ['Fixed indentation', 'Added missing permissions'],
          file: '.github/workflows/ci-assistant.yml'
        };
        const validation = await agent.validateFix(fixData);
        console.log(JSON.stringify(validation, null, 2));
        break;
        
      default:
        console.log(`
Usage: node cursor-agent-integration.js <command> [options]

Commands:
  test                                    - Test connection to Cursor Agent
  suggest <error_type> [context]          - Get fix suggestions
  validate                                - Validate a fix
        `);
    }
  }

  main().catch(console.error);
}

module.exports = CursorAgentIntegration;