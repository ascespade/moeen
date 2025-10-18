import logger from "@/lib/monitoring/logger";

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    return PerformanceMonitor.instance;

  startTiming(label: string): void {
    this.metrics.set(label, performance.now());

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.metrics.delete(label);

    // Log slow operations
    if (duration > 1000) {

    return duration;

  measurePageLoad(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;

        // Send to analytics
        this.sendMetric("page_load_time", loadTime);
      });
    }

  measureComponentRender(componentName: string): void {
    this.startTiming(`component_${componentName}_render`);

  endComponentRender(componentName: string): number {
    return this.endTiming(`component_${componentName}_render`);

  measureAsyncOperation(operationName: string): void {
    this.startTiming(`async_${operationName}`);

  endAsyncOperation(operationName: string): number {
    return this.endTiming(`async_${operationName}`);

  private sendMetric(name: string, value: number): void {
    if (process.env.NODE_ENV === "production") {
      // Send to analytics service
      fetch("/api/analytics/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, value, timestamp: Date.now() }),
      }).catch(logger.error);
    }

  // Memory usage monitoring
  checkMemoryUsage(): void {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize / 1024 / 1024; // MB
      const total = memory.totalJSHeapSize / 1024 / 1024; // MB

      if (used > 100) {
        // Alert if using more than 100MB
        console.warn(
          `High memory usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`,
        );
      }
    }
  }

export default PerformanceMonitor;
