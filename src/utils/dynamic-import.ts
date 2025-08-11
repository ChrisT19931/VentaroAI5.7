'use client';

import dynamic from 'next/dynamic';
import React, { ComponentType, Suspense, lazy } from 'react';

/**
 * Options for dynamic component loading
 */
interface DynamicImportOptions {
  ssr?: boolean;
  loading?: () => React.ReactElement | null;
  suspense?: boolean;
  priority?: boolean;
  preload?: boolean;
}

/**
 * Dynamically imports a component with optimized loading strategy
 * @param importFn Function that imports the component
 * @param options Configuration options for dynamic loading
 * @returns Dynamically loaded component
 */
export function dynamicImport<T>(importFn: () => Promise<{ default: ComponentType<T> }>, options: DynamicImportOptions = {}) {
  const {
    ssr = false,
    loading,
    suspense = true,
    priority = false,
    preload = false,
  } = options;

  // Use Next.js dynamic for SSR/non-SSR scenarios
  const DynamicComponent = dynamic(importFn, {
    ssr,
    loading,
    suspense,
  });

  // Preload the component if specified
  if (preload) {
    importFn();
  }

  return DynamicComponent;
}

/**
 * Creates a lazy-loaded component with Suspense fallback
 * @param importFn Function that imports the component
 * @param fallback Optional fallback component to show while loading
 * @returns Lazy-loaded component wrapped in Suspense
 */
export function lazyWithSuspense<T = {}>(importFn: () => Promise<{ default: ComponentType<T> }>, fallback: React.ReactNode = null) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWithSuspense(props: T) {
    return React.createElement(
      Suspense,
      { fallback },
      React.createElement(LazyComponent as any, props as any)
    );
  };
}

/**
 * Preloads a component without rendering it
 * @param importFn Function that imports the component
 */
export function preloadComponent(importFn: () => Promise<{ default: ComponentType<any> }>) {
  importFn().catch(err => {
    console.warn('Failed to preload component:', err);
  });
}