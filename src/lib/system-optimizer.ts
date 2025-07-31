import React from 'react';
import { performanceMonitor, measureApiCall } from './performance-monitor';
import { checkSupabaseHealth, executeQuery, createClientWithRetry } from './supabase';
import { checkStripeHealth } from './stripe';
import type { Stripe } from 'stripe';

// System optimization configuration
interface OptimizationConfig {
  enableCaching: boolean;
  enableCompression: boolean;
  enableLazyLoading: boolean;
  enablePreloading: boolean;
  enableServiceWorker: boolean;
  cacheTimeout: number;
  retryAttempts: number;
  healthCheckInterval: number;
}

const DEFAULT_CONFIG: OptimizationConfig = {
  enableCaching: true,
  enableCompression: true,
  enableLazyLoading: true,
  enablePreloading: true,
  enableServiceWorker: false, // Disabled by default for safety
  cacheTimeout: 300000, // 5 minutes
  retryAttempts: 3,
  healthCheckInterval: 60000, // 1 minute
};

// Cache implementation
class SystemCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize = 100;

  set(key: string, data: any, ttl: number = DEFAULT_CONFIG.cacheTimeout): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// System optimizer class
class SystemOptimizer {
  private config: OptimizationConfig;
  private cache: SystemCache;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isOptimized = false;
  private supabaseUrl: string;
  private supabaseKey: string;
  private stripeKey: string;
  private sendgridKey: string;
  private systemHealth = {
    supabase: true,
    stripe: true,
    sendgrid: true,
    overall: true,
    lastCheck: Date.now(),
  };

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = new SystemCache();
    
    // Initialize API keys
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    this.stripeKey = process.env.STRIPE_SECRET_KEY || '';
    this.sendgridKey = process.env.SENDGRID_API_KEY || '';
    
    this.initializeOptimizations();
  }

  private async initializeOptimizations() {
    try {
      console.log('Initializing system optimizations...');

      // Start health monitoring
      if (this.config.healthCheckInterval > 0) {
        this.startHealthMonitoring();
      }

      // Initialize browser optimizations
      if (typeof window !== 'undefined') {
        this.initializeBrowserOptimizations();
      }

      // Start cache cleanup
      setInterval(() => this.cache.cleanup(), 60000); // Cleanup every minute

      this.isOptimized = true;
      console.log('System optimizations initialized successfully');
    } catch (error) {
      console.error('Failed to initialize system optimizations:', error);
    }
  }

  private initializeBrowserOptimizations() {
    if (this.config.enableLazyLoading) {
      this.enableLazyLoading();
    }

    if (this.config.enablePreloading) {
      this.enableCriticalResourcePreloading();
    }

    if (this.config.enableCompression) {
      this.enableCompression();
    }

    // Optimize images
    this.optimizeImages();

    // Add performance observers
    this.addPerformanceObservers();
  }

  private enableLazyLoading() {
    // Enable lazy loading for images
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });

    // Observe for new images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const images = element.querySelectorAll('img:not([loading])');
            images.forEach(img => {
              img.setAttribute('loading', 'lazy');
              img.setAttribute('decoding', 'async');
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private enableCriticalResourcePreloading() {
    const criticalResources = [
      '/images/ventaro-logo.svg',
      '/api/health',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.svg') ? 'image' : 'fetch';
      document.head.appendChild(link);
    });
  }

  private enableCompression() {
    // Add compression headers for fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init = {}) {
      const headers = new Headers(init.headers);
      if (!headers.has('Accept-Encoding')) {
        headers.set('Accept-Encoding', 'gzip, deflate, br');
      }
      return originalFetch(input, { ...init, headers });
    };
  }

  private optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add error handling
      img.onerror = () => {
        console.warn(`Failed to load image: ${img.src}`);
        // Set fallback image if available
        if (img.dataset.fallback) {
          img.src = img.dataset.fallback;
        }
      };

      // Optimize loading
      if (!img.loading) img.loading = 'lazy';
      if (!img.decoding) img.decoding = 'async';
    });
  }

  private addPerformanceObservers() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${entry.duration}ms`);
            }
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.log('Long task observation not supported');
      }
    }
  }

  private async checkSupabaseHealth(): Promise<boolean> {
    try {
      // Only run on server side
      if (typeof window !== 'undefined') return true;
      if (!this.supabaseUrl || !this.supabaseKey) return false;
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(this.supabaseUrl, this.supabaseKey);
      const { checkSupabaseHealth } = await import('./supabase');
      return await checkSupabaseHealth(client);
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  }

  private async checkStripeHealth(): Promise<boolean> {
    try {
      // Skip during build time or on client side
      if (typeof window !== 'undefined') return true;
      if (process.env.VERCEL_BUILD === 'true') return true;
      if (!this.stripeKey) return false;
      
      // Dynamically import and initialize Stripe only at runtime
      try {
        const { checkStripeHealth, getStripeInstance } = await import('./stripe');
        const stripe = await getStripeInstance();
        return await checkStripeHealth(stripe as Stripe);
      } catch (importError) {
        console.error('Failed to import Stripe modules:', importError);
        return false;
      }
    } catch (error) {
      console.error('Stripe health check failed:', error);
      return false;
    }
  }

  private async checkSendGridHealth(): Promise<boolean> {
    try {
      // Only run on server side
      if (typeof window !== 'undefined') return true;
      if (!this.sendgridKey) return false;
      const { checkSendGridHealth } = await import('./sendgrid');
      return await checkSendGridHealth();
    } catch (error) {
      console.error('SendGrid health check failed:', error);
      return false;
    }
  }

  private startHealthMonitoring() {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const [supabaseHealth, stripeHealth, sendgridHealth] = await Promise.allSettled([
          measureApiCall(() => this.checkSupabaseHealth(), 'supabase-health'),
          measureApiCall(() => this.checkStripeHealth(), 'stripe-health'),
          measureApiCall(() => this.checkSendGridHealth(), 'sendgrid-health'),
        ]);

        this.systemHealth = {
          supabase: supabaseHealth.status === 'fulfilled' && Boolean(supabaseHealth.value),
          stripe: stripeHealth.status === 'fulfilled' && Boolean(stripeHealth.value),
          sendgrid: sendgridHealth.status === 'fulfilled' && Boolean(sendgridHealth.value),
          overall: true,
          lastCheck: Date.now(),
        };

        this.systemHealth.overall = 
          this.systemHealth.supabase && 
          this.systemHealth.stripe && 
          this.systemHealth.sendgrid;

        // Log health status
        if (!this.systemHealth.overall) {
          console.warn('System health issues detected:', this.systemHealth);
        }
      } catch (error) {
        console.error('Health check failed:', error);
        this.systemHealth.overall = false;
      }
    }, this.config.healthCheckInterval);
  }

  // Public methods
  public async optimizedApiCall<T>(
    apiCall: () => Promise<T>,
    cacheKey?: string,
    cacheTtl?: number
  ): Promise<T> {
    // Check cache first
    if (cacheKey && this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Make API call with performance monitoring
    const result = await measureApiCall(apiCall, cacheKey || 'api-call');

    // Cache result
    if (cacheKey && this.config.enableCaching) {
      this.cache.set(cacheKey, result, cacheTtl);
    }

    return result;
  }

  public async optimizedDatabaseQuery<T>(
    queryFunction: () => Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    return this.optimizedApiCall(async () => {
      try {
        return await queryFunction();
      } catch (error) {
        console.error('Database query failed, attempting retry:', error);
        // Retry with enhanced client
        const retryClient = await createClientWithRetry();
        return await queryFunction();
      }
    }, cacheKey);
  }

  public async optimizedEmailSend(emailData: any): Promise<any> {
    return measureApiCall(async () => {
      const { sendEmailWithValidation } = await import('./sendgrid');
      return await sendEmailWithValidation(emailData);
    }, 'email-send');
  }

  public getSystemHealth() {
    return { ...this.systemHealth };
  }

  public getCacheStats() {
    return {
      size: this.cache.size(),
      maxSize: 100,
      enabled: this.config.enableCaching,
    };
  }

  public clearCache() {
    this.cache.clear();
  }

  public getOptimizationStatus() {
    return {
      isOptimized: this.isOptimized,
      config: this.config,
      systemHealth: this.systemHealth,
      cacheStats: this.getCacheStats(),
      performanceScore: performanceMonitor.getPerformanceScore(),
    };
  }

  public updateConfig(newConfig: Partial<OptimizationConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log('Optimization config updated:', this.config);
  }

  public cleanup() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.cache.clear();
    this.isOptimized = false;
  }
}

// Create singleton instance
export const systemOptimizer = new SystemOptimizer();

// Utility functions
export const optimizedApiCall = <T>(
  apiCall: () => Promise<T>,
  cacheKey?: string,
  cacheTtl?: number
): Promise<T> => {
  return systemOptimizer.optimizedApiCall(apiCall, cacheKey, cacheTtl);
};

export const optimizedDatabaseQuery = <T>(
  queryFunction: () => Promise<T>,
  cacheKey?: string
): Promise<T> => {
  return systemOptimizer.optimizedDatabaseQuery(queryFunction, cacheKey);
};

export const optimizedEmailSend = (emailData: any): Promise<any> => {
  return systemOptimizer.optimizedEmailSend(emailData);
};

export const getSystemHealth = () => {
  return systemOptimizer.getSystemHealth();
};

export const getOptimizationStatus = () => {
  return systemOptimizer.getOptimizationStatus();
};

// React hook for system optimization status
export const useSystemOptimization = () => {
  const [status, setStatus] = React.useState(systemOptimizer.getOptimizationStatus());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStatus(systemOptimizer.getOptimizationStatus());
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    ...status,
    clearCache: systemOptimizer.clearCache.bind(systemOptimizer),
    updateConfig: systemOptimizer.updateConfig.bind(systemOptimizer),
  };
};

// Export types
export type { OptimizationConfig };