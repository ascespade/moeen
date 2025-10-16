#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

class EnhancedAutomationRunner {
  constructor() {
    this.scripts = [
      "scripts/cursor-agent-monitor.js",
      "scripts/file-cleanup.js",
      "scripts/n8n-workflow-manager.js",
      "scripts/social-media-automation.js",
      "scripts/admin-module.js",
    ];
    this.maxConcurrent = 3;
    this.retryAttempts = 3;
  }

  async runScript(scriptPath) {
    return new Promise((resolve, reject) => {
      const child = spawn("node", [scriptPath], {
        stdio: "pipe",
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        resolve({
          script: scriptPath,
          success: code === 0,
          code: code,
          stdout: stdout,
          stderr: stderr,
        });
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  async runAll() {
    console.log("Starting enhanced automation...");

    const results = [];

    for (const script of this.scripts) {
      try {
        const result = await this.runScript(script);
        results.push(result);

        if (result.success) {
          console.log(`✓ ${script} completed`);
        } else {
          console.log(`✗ ${script} failed with code ${result.code}`);
        }
      } catch (error) {
        console.log(`✗ ${script} error: ${error.message}`);
        results.push({
          script: script,
          success: false,
          error: error.message,
        });
      }
    }

    console.log("Enhanced automation completed");
    return results;
  }
}

if (require.main === module) {
  const runner = new EnhancedAutomationRunner();
  runner.runAll().catch(console.error);
}

module.exports = EnhancedAutomationRunner;
