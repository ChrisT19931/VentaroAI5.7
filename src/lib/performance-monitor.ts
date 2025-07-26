import { toast } from 'react-hot-toast';

// Performance metrics interface
interface PerformanceMetrics {
  timestamp: number;
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  memoryUsage?: number;
  connectionLatency: number;
  errorCount: number;
  userInteractions: number;
}

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  loadTime: 3000, // 3 seconds
  renderTime: 100, // 100ms
  apiResponseTime: 2000, // 2 seconds
  connectionLatency: 500, // 500ms
  memoryUsage: 100 * 1024 * 1024, // 100MB
};

// Global performance state
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private startTime: number = Date.now();
  private isMonitoring: boolean = false;
  private errorCount: number = 0;
  private userInteractions: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    try {
      // Monitor navigation timing
      this.observeNavigationTiming();
      
      // Monitor resource loading
      this.observeResourceTiming();
      
      // Monitor layout shifts and paint timing
      this.observeLayoutShifts();
      
      // Monitor user interactions
      this.observeUserInteractions();
      
      // Monitor memory usage (if available)
      this.observeMemoryUsage();
      
      // Monitor errors
      this.observeErrors();
      
      this.isMonitoring = true;
      console.log('Performance monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  private observeNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric({
              timestamp: Date.now(),
              loadTime: navEntry.loadEventEnd - navEntry.startTime,
              renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              apiResponseTime: 0,
              connectionLatency: navEntry.connectEnd - navEntry.connectStart,
              errorCount: this.errorCount,
              userInteractions: this.userInteractions,
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  private observeResourceTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Check for slow resources
            const duration = resourceEntry.responseEnd - resourceEntry.requestStart;
            if (duration > PERFORMANCE_THRESHOLDS.apiResponseTime) {
              console.warn(`Slow resource detected: ${resourceEntry.name} took ${duration}ms`);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  private observeLayoutShifts() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              const layoutShiftEntry = entry as any;
              if (layoutShiftEntry.value > 0.1) {
                console.warn(`Large layout shift detected: ${layoutShiftEntry.value}`);
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
      } catch (error) {
        // Layout shift observation not supported
        console.log('Layout shift observation not supported');
      }
    }
  }

  private observeUserInteractions() {
    if (typeof window !== 'undefined') {
      const events = ['click', 'keydown', 'scroll', 'touchstart'];
      
      events.forEach(eventType => {
        window.addEventListener(eventType, () => {
          this.userInteractions++;
        }, { passive: true });
      });
    }
  }

  private observeMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = (performance as any).memory;
        if (memInfo && memInfo.usedJSHeapSize > PERFORMANCE_THRESHOLDS.memoryUsage) {
          console.warn(`High memory usage detected: ${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private observeErrors() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.errorCount++;
        console.error('JavaScript error detected:', event.error);
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        this.errorCount++;
        console.error('Unhandled promise rejection:', event.reason);
      });
    }
  }

  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
    
    // Check thresholds and warn if necessary
    this.checkThresholds(metric);
  }

  private checkThresholds(metric: PerformanceMetrics) {
    if (metric.loadTime > PERFORMANCE_THRESHOLDS.loadTime) {
      console.warn(`Slow page load detected: ${metric.loadTime}ms`);
    }
    
    if (metric.renderTime > PERFORMANCE_THRESHOLDS.renderTime) {
      console.warn(`Slow render detected: ${metric.renderTime}ms`);
    }
    
    if (metric.apiResponseTime > PERFORMANCE_THRESHOLDS.apiResponseTime) {
      console.warn(`Slow API response detected: ${metric.apiResponseTime}ms`);
    }
    
    if (metric.connectionLatency > PERFORMANCE_THRESHOLDS.connectionLatency) {
      console.warn(`High connection latency detected: ${metric.connectionLatency}ms`);
    }
  }

  // Public methods
  public measureApiCall<T>(apiCall: () => Promise<T>, apiName: string): Promise<T> {
    const startTime = Date.now();
    
    return apiCall()
      .then((result) => {
        const duration = Date.now() - startTime;
        this.recordMetric({
          timestamp: Date.now(),
          loadTime: 0,
          renderTime: 0,
          apiResponseTime: duration,
          connectionLatency: 0,
          errorCount: this.errorCount,
          userInteractions: this.userInteractions,
        });
        
        if (duration > PERFORMANCE_THRESHOLDS.apiResponseTime) {
          console.warn(`Slow API call: ${apiName} took ${duration}ms`);
        }
        
        return result;
      })
      .catch((error) => {
        const duration = Date.now() - startTime;
        this.errorCount++;
        console.error(`API call failed: ${apiName} after ${duration}ms`, error);
        throw error;
      });
  }

  public measureRender<T>(renderFunction: () => T, componentName: string): T {
    const startTime = performance.now();
    const result = renderFunction();
    const duration = performance.now() - startTime;
    
    if (duration > PERFORMANCE_THRESHOLDS.renderTime) {
      console.warn(`Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {};
    
    const totals = this.metrics.reduce(
      (acc, metric) => ({
        loadTime: acc.loadTime + metric.loadTime,
        renderTime: acc.renderTime + metric.renderTime,
        apiResponseTime: acc.apiResponseTime + metric.apiResponseTime,
        connectionLatency: acc.connectionLatency + metric.connectionLatency,
      }),
      { loadTime: 0, renderTime: 0, apiResponseTime: 0, connectionLatency: 0 }
    );
    
    const count = this.metrics.length;
    return {
      loadTime: totals.loadTime / count,
      renderTime: totals.renderTime / count,
      apiResponseTime: totals.apiResponseTime / count,
      connectionLatency: totals.connectionLatency / count,
      errorCount: this.errorCount,
      userInteractions: this.userInteractions,
    };
  }

  public getPerformanceScore(): number {
    const averages = this.getAverageMetrics();
    let score = 100;
    
    // Deduct points for poor performance
    if (averages.loadTime && averages.loadTime > PERFORMANCE_THRESHOLDS.loadTime) {
      score -= 20;
    }
    if (averages.renderTime && averages.renderTime > PERFORMANCE_THRESHOLDS.renderTime) {
      score -= 15;
    }
    if (averages.apiResponseTime && averages.apiResponseTime > PERFORMANCE_THRESHOLDS.apiResponseTime) {
      score -= 20;
    }
    if (averages.connectionLatency && averages.connectionLatency > PERFORMANCE_THRESHOLDS.connectionLatency) {
      score -= 10;
    }
    if (this.errorCount > 0) {
      score -= Math.min(this.errorCount * 5, 35);
    }
    
    return Math.max(score, 0);
  }

  public generateReport(): string {
    const averages = this.getAverageMetrics();
    const score = this.getPerformanceScore();
    
    return `
Performance Report:
==================
Score: ${score}/100
Average Load Time: ${averages.loadTime?.toFixed(2)}ms
Average Render Time: ${averages.renderTime?.toFixed(2)}ms
Average API Response Time: ${averages.apiResponseTime?.toFixed(2)}ms
Average Connection Latency: ${averages.connectionLatency?.toFixed(2)}ms
Total Errors: ${this.errorCount}
User Interactions: ${this.userInteractions}
Monitoring Duration: ${((Date.now() - this.startTime) / 1000 / 60).toFixed(2)} minutes
`;
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for easy use
export const measureApiCall = <T>(apiCall: () => Promise<T>, apiName: string): Promise<T> => {
  return performanceMonitor.measureApiCall(apiCall, apiName);
};

export const measureRender = <T>(renderFunction: () => T, componentName: string): T => {
  return performanceMonitor.measureRender(renderFunction, componentName);
};

export const getPerformanceReport = (): string => {
  return performanceMonitor.generateReport();
};

export const getPerformanceScore = (): number => {
  return performanceMonitor.getPerformanceScore();
};

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = React.useState(performanceMonitor.getMetrics());
  const [score, setScore] = React.useState(performanceMonitor.getPerformanceScore());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
      setScore(performanceMonitor.getPerformanceScore());
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    metrics,
    score,
    averageMetrics: performanceMonitor.getAverageMetrics(),
    generateReport: performanceMonitor.generateReport.bind(performanceMonitor),
  };
};

// Performance optimization utilities
export const optimizeImages = () => {
  if (typeof window !== 'undefined') {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      if (!img.decoding) {
        img.decoding = 'async';
      }
    });
  }
};

export const preloadCriticalResources = (urls: string[]) => {
  if (typeof window !== 'undefined') {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }
};

// Add React import for the hook
import React from 'react';