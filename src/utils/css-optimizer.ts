/**
 * CSS optimization utilities for improving rendering performance
 */

import { detectDeviceCapabilities } from './performance-optimizer';

/**
 * Configuration options for CSS optimization
 */
export interface CssOptimizerConfig {
  /** Whether to apply will-change property to animated elements */
  applyWillChange?: boolean;
  /** Whether to reduce motion for users with reduced motion preference */
  respectReducedMotion?: boolean;
  /** Whether to optimize for low-end devices */
  optimizeForLowEnd?: boolean;
  /** Whether to optimize for battery saving */
  optimizeForBatterySaving?: boolean;
  /** Whether to inline critical CSS */
  inlineCriticalCss?: boolean;
  /** Whether to defer non-critical CSS */
  deferNonCriticalCss?: boolean;
  /** CSS variables to apply */
  cssVariables?: Record<string, string>;
}

/**
 * Default configuration for CSS optimization
 */
export const DEFAULT_CSS_CONFIG: CssOptimizerConfig = {
  applyWillChange: true,
  respectReducedMotion: true,
  optimizeForLowEnd: true,
  optimizeForBatterySaving: true,
  inlineCriticalCss: true,
  deferNonCriticalCss: true,
  cssVariables: {},
};

/**
 * Applies CSS variables to the document root based on device capabilities and preferences
 * @param isLowEndDevice Whether the device is a low-end device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 * @param isBatterySaving Whether battery saving mode is enabled
 * @param prefersReducedMotion Whether the user prefers reduced motion
 * @param customVariables Custom CSS variables to apply
 */
export function applyCssVariables(
  isLowEndDevice: boolean = false,
  isBatterySaving: boolean = false,
  prefersReducedMotion: boolean = false,
  customVariables: Record<string, string> = {}
): void {
  const root = document.documentElement;
  
  // Performance-related variables
  root.style.setProperty('--animation-duration-factor', getAnimationDurationFactor(isLowEndDevice, isBatterySaving, prefersReducedMotion));
  root.style.setProperty('--transition-duration-factor', getTransitionDurationFactor(isLowEndDevice, isBatterySaving, prefersReducedMotion));
  root.style.setProperty('--animation-complexity', getAnimationComplexity(isLowEndDevice, isBatterySaving, prefersReducedMotion));
  root.style.setProperty('--effect-intensity', getEffectIntensity(isLowEndDevice, isBatterySaving, prefersReducedMotion));
  root.style.setProperty('--image-quality', getImageQuality(isLowEndDevice, isBatterySaving));
  
  // Apply custom variables
  Object.entries(customVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

/**
 * Gets the animation duration factor based on device capabilities and preferences
 * @param isLowEndDevice Whether the device is a low-end device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 */
function getAnimationDurationFactor(
  isLowEndDevice: boolean,
  isBatterySaving: boolean,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion) return '0.5'; // 50% duration for reduced motion
  if (isLowEndDevice) return '0.75'; // 75% duration for low-end devices
  if (isBatterySaving) return '0.9'; // 90% duration for battery saving
  return '1'; // 100% duration for normal devices
}

/**
 * Gets the transition duration factor based on device capabilities and preferences
 * @param isLowEndDevice Whether the device is a low-end device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 */
function getTransitionDurationFactor(
  isLowEndDevice: boolean,
  isBatterySaving: boolean,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion) return '0.5'; // 50% duration for reduced motion
  if (isLowEndDevice) return '0.75'; // 75% duration for low-end devices
  if (isBatterySaving) return '0.9'; // 90% duration for battery saving
  return '1'; // 100% duration for normal devices
}

/**
 * Gets the animation complexity based on device capabilities and preferences
 * @param isLowEndDevice Whether the device is a low-end device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 */
function getAnimationComplexity(
  isLowEndDevice: boolean,
  isBatterySaving: boolean,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion) return '0'; // No complex animations for reduced motion
  if (isLowEndDevice) return '0.5'; // 50% complexity for low-end devices
  if (isBatterySaving) return '0.75'; // 75% complexity for battery saving
  return '1'; // 100% complexity for normal devices
}

/**
 * Gets the effect intensity based on device capabilities and preferences
 * @param isLowEndDevice Whether the device is a low-end device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 */
function getEffectIntensity(
  isLowEndDevice: boolean,
  isBatterySaving: boolean,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion) return '0.25'; // 25% intensity for reduced motion
  if (isLowEndDevice) return '0.5'; // 50% intensity for low-end devices
  if (isBatterySaving) return '0.75'; // 75% intensity for battery saving
  return '1'; // 100% intensity for normal devices
}

/**
 * Gets the image quality based on device capabilities
 * @param isLowEndDevice Whether the device is a low-end device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 */
function getImageQuality(
  isLowEndDevice: boolean,
  isBatterySaving: boolean
): string {
  if (isLowEndDevice) return '0.75'; // 75% quality for low-end devices
  if (isBatterySaving) return '0.9'; // 90% quality for battery saving
  return '1'; // 100% quality for normal devices
}

/**
 * Optimizes CSS animations by applying will-change property to animated elements
 * @param selector CSS selector for animated elements
 * @param property Property to optimize (transform, opacity, etc.)
 */
export function optimizeCssAnimations(selector: string, property: string = 'transform'): void {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element) => {
    (element as HTMLElement).style.willChange = property;
  });
}

/**
 * Inlines critical CSS to improve page load performance
 * @param cssText CSS text to inline
 */
export function inlineCriticalCss(cssText: string): void {
  const style = document.createElement('style');
  style.setAttribute('data-critical', 'true');
  style.textContent = cssText;
  document.head.appendChild(style);
}

/**
 * Defers loading of non-critical CSS
 * @param href URL of the CSS file to defer
 */
export function deferNonCriticalCss(href: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.onload = function() {
    link.onload = null;
    link.rel = 'stylesheet';
  };
  document.head.appendChild(link);
}

/**
 * Extracts critical CSS from the page
 * @param selectors Array of critical CSS selectors
 */
export function extractCriticalCss(selectors: string[]): string {
  let criticalCss = '';
  
  // Get all stylesheets
  const styleSheets = Array.from(document.styleSheets);
  
  try {
    styleSheets.forEach((sheet) => {
      try {
        // Get all CSS rules
        const rules = Array.from(sheet.cssRules || []);
        
        rules.forEach((rule) => {
          if (rule instanceof CSSStyleRule) {
            // Check if the rule matches any of the critical selectors
            const isMatch = selectors.some((selector) => {
              return rule.selectorText.includes(selector);
            });
            
            if (isMatch) {
              criticalCss += rule.cssText + '\n';
            }
          }
        });
      } catch (e) {
        // Skip cross-origin stylesheets
        console.warn('Could not access stylesheet:', e);
      }
    });
  } catch (e) {
    console.error('Error extracting critical CSS:', e);
  }
  
  return criticalCss;
}

/**
 * Initializes CSS optimization
 * @param config Configuration options
 */
export function initializeCssOptimization(config: CssOptimizerConfig = DEFAULT_CSS_CONFIG): () => void {
  const {
    applyWillChange,
    respectReducedMotion,
    optimizeForLowEnd,
    optimizeForBatterySaving,
    inlineCriticalCss: shouldInlineCriticalCss,
    deferNonCriticalCss: shouldDeferNonCriticalCss,
    cssVariables,
  } = { ...DEFAULT_CSS_CONFIG, ...config };
  
  // Check device capabilities and preferences
  const prefersReducedMotion = respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Use detectDeviceCapabilities for consistent device capability detection
  let isLowEndDevice = false;
  let isBatterySaving = false;
  
  // Handle async operations
  if (optimizeForLowEnd) {
    detectDeviceCapabilities().then(capabilities => {
      isLowEndDevice = capabilities.isLowEnd;
      // Re-apply CSS variables with updated device capabilities
      applyCssVariables(isLowEndDevice, isBatterySaving, prefersReducedMotion, cssVariables);
    });
  }
  
  if (optimizeForBatterySaving && 'getBattery' in navigator) {
    checkBatterySaving().then(batterySaving => {
      isBatterySaving = batterySaving;
      // Re-apply CSS variables with updated battery status
      applyCssVariables(isLowEndDevice, isBatterySaving, prefersReducedMotion, cssVariables);
    });
  }
  
  // Apply CSS variables with initial values
  applyCssVariables(isLowEndDevice, isBatterySaving, prefersReducedMotion, cssVariables);
  
  // Apply will-change to animated elements
  if (applyWillChange) {
    optimizeCssAnimations('.animated, .animate, [data-animate]');
    optimizeCssAnimations('.fade, .fade-in, .fade-out', 'opacity');
    optimizeCssAnimations('.slide, .slide-in, .slide-out', 'transform');
  }
  
  // Set up media query listeners
  const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleReducedMotionChange = (e: MediaQueryListEvent) => {
    applyCssVariables(isLowEndDevice, isBatterySaving, e.matches, cssVariables);
  };
  
  reducedMotionMediaQuery.addEventListener('change', handleReducedMotionChange);
  
  // Return cleanup function
  return () => {
    reducedMotionMediaQuery.removeEventListener('change', handleReducedMotionChange);
  };
}

/**
 * Checks if battery saving mode is enabled
 */
async function checkBatterySaving(): Promise<boolean> {
  try {
    const battery = await (navigator as any).getBattery();
    return battery.charging === false && battery.level < 0.2;
  } catch (e) {
    console.warn('Battery API not supported:', e);
    return false;
  }
}