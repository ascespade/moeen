/**
 * Monitoring System Types
 * أنواع نظام المراقبة
 */

export interface TaskStatus {
  id: string;
  name: string;
  cpu: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number; // 0-100
  startTime: Date;
  endTime?: Date;
  errors: string[];
  results: unknown;
  metadata?: Record<string, any>;
}

export interface MonitoringReport {
  total: number;
  completed: number;
  progress: number;
  byStatus: {
    pending: number;
    running: number;
    completed: number;
    error: number;
  };
  byCpu: Record<number, number>;
  tasks: TaskStatus[];
  timestamp: Date;
}

export type TaskType =
  | 'code-analysis'
  | 'performance'
  | 'security'
  | 'browser-test'
  | 'accessibility'
  | 'seo'
  | 'build-check';

export interface TaskConfig {
  id: string;
  name: string;
  type: TaskType;
  cpu: number;
  data: unknown;
}

