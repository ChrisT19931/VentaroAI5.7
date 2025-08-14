// Comprehensive Analytics & Conversion Tracking System

// Global gtag function declaration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
  page: string;
  userAgent: string;
}

export interface ConversionFunnel {
  step: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  value?: number;
  productId?: string;
}

class AnalyticsTracker {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private funnelSteps: ConversionFunnel[] = [];
  
  constructor() {
    this.sessionId = this.generateSessionId();
    // Only initialize tracking on client side
    if (typeof window !== 'undefined') {
      this.initializeTracking();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    // Track page views
    this.trackPageView();
    
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track time on page
    this.trackTimeOnPage();
    
    // Track exit intent
    this.trackExitIntent();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  // Core tracking methods
  track(event: string, properties: Record<string, any> = {}) {
    // Only track on client side
    if (typeof window === 'undefined') return;
    
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        referrer: document.referrer,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      page: window.location.pathname,
      userAgent: navigator.userAgent
    };

    this.events.push(analyticsEvent);
    this.sendToServer(analyticsEvent);
    
    // Also send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
  }

  // Conversion funnel tracking
  trackFunnelStep(step: string, value?: number, productId?: string) {
    const funnelEvent: ConversionFunnel = {
      step,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      value,
      productId
    };

    this.funnelSteps.push(funnelEvent);
    this.track(`funnel_${step}`, { value, productId });
  }

  // E-commerce tracking
  trackPurchaseIntent(productId: string, productName: string, price: number) {
    this.track('purchase_intent', {
      product_id: productId,
      product_name: productName,
      price,
      currency: 'AUD'
    });
    this.trackFunnelStep('purchase_intent', price, productId);
  }

  trackCheckoutStart(productId: string, productName: string, price: number) {
    this.track('checkout_start', {
      product_id: productId,
      product_name: productName,
      price,
      currency: 'AUD'
    });
    this.trackFunnelStep('checkout_start', price, productId);
  }

  trackPurchaseComplete(productId: string, productName: string, price: number, orderId: string) {
    this.track('purchase_complete', {
      product_id: productId,
      product_name: productName,
      price,
      currency: 'AUD',
      order_id: orderId,
      revenue: price
    });
    this.trackFunnelStep('purchase_complete', price, productId);
  }

  trackUpsellView(productIds: string[], totalValue: number) {
    this.track('upsell_view', {
      product_ids: productIds,
      total_value: totalValue,
      currency: 'AUD'
    });
    this.trackFunnelStep('upsell_view', totalValue);
  }

  trackUpsellPurchase(productIds: string[], totalValue: number) {
    this.track('upsell_purchase', {
      product_ids: productIds,
      total_value: totalValue,
      currency: 'AUD'
    });
    this.trackFunnelStep('upsell_purchase', totalValue);
  }

  // Engagement tracking
  trackButtonClick(buttonText: string, location: string) {
    this.track('button_click', {
      button_text: buttonText,
      location,
      page: window.location.pathname
    });
  }

  trackFormSubmit(formName: string, formData: Record<string, any>) {
    this.track('form_submit', {
      form_name: formName,
      form_data: formData
    });
  }

  trackVideoPlay(videoId: string, videoTitle: string) {
    this.track('video_play', {
      video_id: videoId,
      video_title: videoTitle
    });
  }

  trackVideoComplete(videoId: string, videoTitle: string, duration: number) {
    this.track('video_complete', {
      video_id: videoId,
      video_title: videoTitle,
      duration
    });
  }

  // Advanced tracking
  private trackPageView() {
    if (typeof window === 'undefined') return;
    this.track('page_view', {
      page: window.location.pathname,
      title: document.title
    });
  }

  private trackScrollDepth() {
    if (typeof window === 'undefined') return;
    
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestone percentages
        if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
          this.track('scroll_depth', {
            percentage: scrollPercent,
            page: window.location.pathname
          });
        }
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  private trackTimeOnPage() {
    if (typeof window === 'undefined') return;
    
    const startTime = Date.now();
    
    const trackTime = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.track('time_on_page', {
        duration: timeSpent,
        page: window.location.pathname
      });
    };

    // Track time milestones
    setTimeout(() => trackTime(), 30000); // 30 seconds
    setTimeout(() => trackTime(), 60000); // 1 minute
    setTimeout(() => trackTime(), 180000); // 3 minutes

    window.addEventListener('beforeunload', trackTime);
  }

  private trackExitIntent() {
    if (typeof window === 'undefined') return;
    
    let hasTriggered = false;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        hasTriggered = true;
        this.track('exit_intent', {
          page: window.location.pathname,
          time_on_page: Date.now() - performance.now()
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
  }

  // A/B Testing support
  trackExperiment(experimentName: string, variant: string) {
    this.track('experiment_view', {
      experiment_name: experimentName,
      variant
    });
  }

  // Send data to server
  private async sendToServer(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  // Heatmap tracking
  trackClick(x: number, y: number, element: string) {
    this.track('click_heatmap', {
      x,
      y,
      element,
      page: window.location.pathname,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  }

  // Error tracking
  trackError(error: Error, context?: string) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
      page: window.location.pathname
    });
  }

  // Performance tracking
  trackPerformance() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.track('performance', {
        page_load_time: navigation.loadEventEnd - navigation.fetchStart,
        dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        first_paint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        largest_contentful_paint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0
      });
    }
  }

  // Get conversion metrics
  getConversionRate(): number {
    const purchaseIntents = this.funnelSteps.filter(step => step.step === 'purchase_intent').length;
    const purchases = this.funnelSteps.filter(step => step.step === 'purchase_complete').length;
    
    return purchaseIntents > 0 ? (purchases / purchaseIntents) * 100 : 0;
  }

  // Export data for analysis
  exportData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      events: this.events,
      funnelSteps: this.funnelSteps,
      conversionRate: this.getConversionRate()
    };
  }
}

// Global analytics instance
export const analytics = new AnalyticsTracker();

// Convenience functions for React components
export const useAnalytics = () => {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    analytics.track(event, properties);
  };

  const trackPurchase = (productId: string, productName: string, price: number, orderId: string) => {
    analytics.trackPurchaseComplete(productId, productName, price, orderId);
  };

  const trackButtonClick = (buttonText: string, location: string) => {
    analytics.trackButtonClick(buttonText, location);
  };

  return {
    trackEvent,
    trackPurchase,
    trackButtonClick,
    analytics
  };
};

// Initialize click tracking
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    analytics.trackClick(
      e.clientX,
      e.clientY,
      target.tagName.toLowerCase() + (target.className ? '.' + target.className.split(' ').join('.') : '')
    );
  });

  // Initialize performance tracking
  window.addEventListener('load', () => {
    setTimeout(() => analytics.trackPerformance(), 1000);
  });

  // Track errors
  window.addEventListener('error', (e) => {
    analytics.trackError(new Error(e.message), e.filename + ':' + e.lineno);
  });
} 