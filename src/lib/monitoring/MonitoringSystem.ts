/**
 * Monitoring System
 * نظام المراقبة
 */

import { TaskStatus, MonitoringReport } from './types';

export class MonitoringSystem {
  private tasks: Map<string, TaskStatus> = new Map();
  private totalTasks = 0;
  private completedTasks = 0;
  private listeners: Set<(report: MonitoringReport) => void> = new Set();

  /**
   * Add a new task to monitoring
   */
  addTask(task: TaskStatus): void {
    this.tasks.set(task.id, task);
    this.totalTasks++;
    this.notifyListeners();
  }

  /**
   * Update task status
   */
  updateTask(id: string, updates: Partial<TaskStatus>): void {
    const task = this.tasks.get(id);
    if (task) {
      const wasCompleted = task.status === 'completed';
      Object.assign(task, updates);

      if (!wasCompleted && updates.status === 'completed') {
        this.completedTasks++;
        task.endTime = new Date();
      }

      this.notifyListeners();
    }
  }

  /**
   * Get current monitoring report
   */
  getReport(): MonitoringReport {
    const byStatus = {
      pending: 0,
      running: 0,
      completed: 0,
      error: 0,
    };

    this.tasks.forEach(task => {
      byStatus[task.status]++;
    });

    const byCpu: Record<number, number> = {};
    this.tasks.forEach(task => {
      if (task.status === 'running') {
        byCpu[task.cpu] = (byCpu[task.cpu] || 0) + 1;
      }
    });

    return {
      total: this.totalTasks,
      completed: this.completedTasks,
      progress:
        this.totalTasks > 0 ? (this.completedTasks / this.totalTasks) * 100 : 0,
      byStatus,
      byCpu,
      tasks: Array.from(this.tasks.values()),
      timestamp: new Date(),
    };
  }

  /**
   * Get tasks by CPU
   */
  getTasksByCPU(): Record<number, TaskStatus[]> {
    const byCpu: Record<number, TaskStatus[]> = {};
    this.tasks.forEach(task => {
      if (!byCpu[task.cpu]) {
        byCpu[task.cpu] = [];
      }
      byCpu[task.cpu].push(task);
    });
    return byCpu;
  }

  /**
   * Subscribe to report updates
   */
  subscribe(listener: (report: MonitoringReport) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    const report = this.getReport();
    this.listeners.forEach(listener => {
      try {
        listener(report);
      } catch (error) {
        console.error('Error in monitoring listener:', error);
      }
    });
  }

  /**
   * Reset monitoring system
   */
  reset(): void {
    this.tasks.clear();
    this.totalTasks = 0;
    this.completedTasks = 0;
    this.notifyListeners();
  }

  /**
   * Get task by ID
   */
  getTask(id: string): TaskStatus | undefined {
    return this.tasks.get(id);
  }
}

// Singleton instance
export const monitoringSystem = new MonitoringSystem();
