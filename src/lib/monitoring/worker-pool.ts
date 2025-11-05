/**
 * Worker Pool for Parallel Processing
 * تجمع العمال للمعالجة المتوازية
 */

import { TaskConfig } from './types';
import { monitoringSystem } from './MonitoringSystem';

// Use environment variable or default to 4
const NUM_CPUS = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_NUM_CPUS ? parseInt(process.env.NEXT_PUBLIC_NUM_CPUS) : 4)
  : 4;

export class WorkerPool {
  private taskQueue: TaskConfig[] = [];
  private isRunning = false;
  private activeTasks: Map<string, Promise<void>> = new Map();

  constructor() {
    // Pool is ready
  }

  /**
   * Add task to queue
   */
  addTask(task: TaskConfig): void {
    this.taskQueue.push(task);

    // Add to monitoring
    monitoringSystem.addTask({
      id: task.id,
      name: task.name,
      cpu: task.cpu,
      status: 'pending',
      progress: 0,
      startTime: new Date(),
      errors: [],
      results: null,
    });

    // Process if not running
    if (!this.isRunning) {
      this.processQueue();
    }
  }

  /**
   * Process task queue
   */
  private async processQueue(): Promise<void> {
    if (this.taskQueue.length === 0) {
      this.isRunning = false;
      return;
    }

    this.isRunning = true;

    // Process tasks in parallel (one per CPU)
    const activeTasks: Promise<void>[] = [];

    for (let cpu = 0; cpu < NUM_CPUS && this.taskQueue.length > 0; cpu++) {
      const task = this.taskQueue.shift();
      if (task) {
        activeTasks.push(this.executeTask(task, cpu));
      }
    }

    // Wait for all tasks to complete
    await Promise.all(activeTasks);

    // Continue processing remaining tasks
    if (this.taskQueue.length > 0) {
      await this.processQueue();
    } else {
      this.isRunning = false;
    }
  }

  /**
   * Execute task on specific CPU
   */
  private async executeTask(task: TaskConfig, cpu: number): Promise<void> {
    monitoringSystem.updateTask(task.id, {
      status: 'running',
      cpu,
      startTime: new Date(),
      progress: 10,
    });

    try {
      // Simulate task execution
      // In real implementation, this would run actual checks
      const result = await this.runTask(task, cpu);

      monitoringSystem.updateTask(task.id, {
        status: 'completed',
        progress: 100,
        endTime: new Date(),
        results: result,
      });
    } catch (error: any) {
      monitoringSystem.updateTask(task.id, {
        status: 'error',
        errors: [error.message || String(error)],
        endTime: new Date(),
      });
    }
  }

  /**
   * Run actual task
   */
  private async runTask(task: TaskConfig, cpu: number): Promise<any> {
    // Update progress
    monitoringSystem.updateTask(task.id, { progress: 30 });

    // Simulate different task types
    switch (task.type) {
      case 'code-analysis':
        return await this.runCodeAnalysis(task, cpu);
      case 'performance':
        return await this.runPerformanceCheck(task, cpu);
      case 'security':
        return await this.runSecurityCheck(task, cpu);
      case 'browser-test':
        return await this.runBrowserTest(task, cpu);
      default:
        return { message: 'Task completed' };
    }
  }

  private async runCodeAnalysis(task: TaskConfig, _cpu: number): Promise<any> {
    // Simulate code analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    monitoringSystem.updateTask(task.id, { progress: 60 });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    monitoringSystem.updateTask(task.id, { progress: 90 });

    return {
      filesChecked: 150,
      errorsFound: 0,
      warnings: 3,
    };
  }

  private async runPerformanceCheck(task: TaskConfig, _cpu: number): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    monitoringSystem.updateTask(task.id, { progress: 50 });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    monitoringSystem.updateTask(task.id, { progress: 100 });

    return {
      bundleSize: '2.5MB',
      loadTime: '1.2s',
      score: 95,
    };
  }

  private async runSecurityCheck(task: TaskConfig, _cpu: number): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    monitoringSystem.updateTask(task.id, { progress: 70 });

    await new Promise((resolve) => setTimeout(resolve, 1200));
    monitoringSystem.updateTask(task.id, { progress: 100 });

    return {
      vulnerabilities: 0,
      advisories: 2,
      score: 98,
    };
  }

  private async runBrowserTest(task: TaskConfig, _cpu: number): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    monitoringSystem.updateTask(task.id, { progress: 40 });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    monitoringSystem.updateTask(task.id, { progress: 80 });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    monitoringSystem.updateTask(task.id, { progress: 100 });

    return {
      pagesTested: 5,
      errors: 0,
      warnings: 1,
    };
  }

  /**
   * Get current status
   */
  getStatus(): {
    isRunning: boolean;
    queueLength: number;
    activeWorkers: number;
  } {
    return {
      isRunning: this.isRunning,
      queueLength: this.taskQueue.length,
      activeWorkers: NUM_CPUS,
    };
  }

  /**
   * Shutdown worker pool
   */
  async shutdown(): Promise<void> {
    // Wait for all tasks to complete
    while (this.isRunning || this.activeTasks.size > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.taskQueue = [];
    this.activeTasks.clear();
  }
}

// Singleton instance
export const workerPool = new WorkerPool();

