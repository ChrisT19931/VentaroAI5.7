import { NextRequest, NextResponse } from 'next/server';
import { performanceMonitor, getPerformanceReport, getPerformanceScore } from '@/lib/performance-monitor';
import { checkSupabaseHealth, supabase } from '@/lib/supabase';
import { checkStripeHealth, stripe } from '@/lib/stripe';
import { checkSendGridHealth, getEmailStats } from '@/lib/sendgrid';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get performance metrics
    const metrics = performanceMonitor.getMetrics();
    const averageMetrics = performanceMonitor.getAverageMetrics();
    const performanceScore = getPerformanceScore();
    
    // Check service health for performance impact
    const [supabaseHealthy, stripeHealthy, sendGridHealthy] = await Promise.allSettled([
      checkSupabaseHealth(supabase),
      checkStripeHealth(stripe),
      checkSendGridHealth(),
    ]);
    
    const emailStats = getEmailStats();
    
    // Calculate service performance scores
    const servicePerformance = {
      supabase: {
        healthy: supabaseHealthy.status === 'fulfilled' && supabaseHealthy.value,
        impact: supabaseHealthy.status === 'fulfilled' && supabaseHealthy.value ? 0 : -20,
      },
      stripe: {
        healthy: stripeHealthy.status === 'fulfilled' && stripeHealthy.value,
        impact: stripeHealthy.status === 'fulfilled' && stripeHealthy.value ? 0 : -15,
      },
      sendgrid: {
        healthy: sendGridHealthy.status === 'fulfilled' && sendGridHealthy.value,
        impact: sendGridHealthy.status === 'fulfilled' && sendGridHealthy.value ? 0 : -10,
        stats: emailStats,
      },
    };
    
    // Calculate overall performance score
    const serviceImpact = Object.values(servicePerformance).reduce(
      (total, service) => total + service.impact, 0
    );
    const overallScore = Math.max(performanceScore + serviceImpact, 0);
    
    // Performance recommendations
    const recommendations = generateRecommendations(averageMetrics, servicePerformance, overallScore);
    
    const performanceData = {
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      overallScore,
      performanceScore,
      serviceImpact,
      metrics: {
        total: metrics.length,
        averages: averageMetrics,
        recent: metrics.slice(-10), // Last 10 metrics
      },
      services: servicePerformance,
      recommendations,
      thresholds: {
        loadTime: 3000,
        renderTime: 100,
        apiResponseTime: 2000,
        connectionLatency: 500,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        deployment: process.env.VERCEL ? 'vercel' : 'local',
        timestamp: new Date().toISOString(),
      },
    };
    
    // Determine HTTP status based on performance
    const httpStatus = overallScore >= 80 ? 200 : 
                     overallScore >= 60 ? 207 : 503;
    
    return NextResponse.json(performanceData, { status: httpStatus });
    
  } catch (error) {
    console.error('Performance monitoring error:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Performance monitoring failed',
      overallScore: 0,
      status: 'error',
    }, { status: 500 });
  }
}

// Generate performance recommendations
function generateRecommendations(averageMetrics: any, servicePerformance: any, overallScore: number): string[] {
  const recommendations: string[] = [];
  
  // Load time recommendations
  if (averageMetrics.loadTime && averageMetrics.loadTime > 3000) {
    recommendations.push('Consider optimizing images and enabling compression to reduce load times');
    recommendations.push('Implement code splitting and lazy loading for better performance');
  }
  
  // Render time recommendations
  if (averageMetrics.renderTime && averageMetrics.renderTime > 100) {
    recommendations.push('Optimize React components and reduce unnecessary re-renders');
    recommendations.push('Consider using React.memo and useMemo for expensive computations');
  }
  
  // API response time recommendations
  if (averageMetrics.apiResponseTime && averageMetrics.apiResponseTime > 2000) {
    recommendations.push('Optimize database queries and consider implementing caching');
    recommendations.push('Review API endpoints for potential bottlenecks');
  }
  
  // Connection latency recommendations
  if (averageMetrics.connectionLatency && averageMetrics.connectionLatency > 500) {
    recommendations.push('Consider using a CDN to reduce connection latency');
    recommendations.push('Optimize server location and network configuration');
  }
  
  // Service-specific recommendations
  if (!servicePerformance.supabase.healthy) {
    recommendations.push('Supabase connection issues detected - check database configuration');
  }
  
  if (!servicePerformance.stripe.healthy) {
    recommendations.push('Stripe API issues detected - verify API keys and network connectivity');
  }
  
  if (!servicePerformance.sendgrid.healthy) {
    recommendations.push('SendGrid email service issues detected - check API configuration');
  }
  
  // Error count recommendations
  if (averageMetrics.errorCount && averageMetrics.errorCount > 0) {
    recommendations.push('JavaScript errors detected - review error logs and fix issues');
    recommendations.push('Implement better error handling and user feedback');
  }
  
  // Overall score recommendations
  if (overallScore < 60) {
    recommendations.push('Critical performance issues detected - immediate optimization required');
    recommendations.push('Consider implementing performance monitoring alerts');
  } else if (overallScore < 80) {
    recommendations.push('Performance could be improved - review and optimize key metrics');
  }
  
  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push('Performance is good - continue monitoring for any degradation');
    recommendations.push('Consider implementing advanced optimizations like service workers');
  }
  
  return recommendations;
}

// Performance report endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case 'generate-report':
        const report = getPerformanceReport();
        return NextResponse.json({ report, timestamp: new Date().toISOString() });
        
      case 'clear-metrics':
        // Clear performance metrics (if needed)
        return NextResponse.json({ 
          message: 'Metrics cleared successfully',
          timestamp: new Date().toISOString() 
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Performance action error:', error);
    return NextResponse.json(
      { error: 'Failed to process performance action' },
      { status: 500 }
    );
  }
}