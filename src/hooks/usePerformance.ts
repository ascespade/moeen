import { useEffect } from 'react';
import { PerformanceMonitor } from '@/lib/performance';

export function usePerformance() {
  const monitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    // Initialize performance monitoring
    monitor.measurePageLoad();
    
    // Check memory usage periodically
    const memoryCheckInterval = setInterval(() => {
      monitor.checkMemoryUsage();
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(memoryCheckInterval);
    };
  }, [monitor]);

  const measureAsync = async <T>(
    label: string,
    fn: () => Promise<T>,
  ): Promise<T> => {
    monitor.measureAsyncOperation(label);
    try {
      const result = await fn();
      return result;
    } finally {
      monitor.endAsyncOperation(label);
    }
  };

  const measureSync = <T>(label: string, fn: () => T): T => {
    monitor.measureAsyncOperation(label);
    try {
      const result = fn();
      return result;
    } finally {
      monitor.endAsyncOperation(label);
    }
  };

  const measureComponent = (componentName: string) => {
    monitor.measureComponentRender(componentName);
    return () => monitor.endComponentRender(componentName);
  };

  return { 
    measureAsync, 
    measureSync, 
    measureComponent,
    monitor 
  };
}

export default usePerformance;