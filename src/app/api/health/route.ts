import { NextRequest, NextResponse } from 'next/server';
import { checkSupabaseHealth, supabase } from '@/lib/supabase';
import { checkStripeHealth, stripe } from '@/lib/stripe';
import { checkSendGridHealth, getEmailStats } from '@/lib/sendgrid';
import { getSystemHealth, getOptimizationStatus } from '@/lib/system-optimizer';
import { performanceMonitor } from '@/lib/performance-monitor';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check all service health in parallel for faster response
    const [supabaseHealthy, stripeHealthy, sendGridHealthy] = await Promise.allSettled([
      checkSupabaseHealth(supabase),
      checkStripeHealth(stripe),
      checkSendGridHealth(),
    ]);
    
    const emailStats = getEmailStats();
    
    // Get system optimization status
    const systemHealth = getSystemHealth();
    const optimizationStatus = getOptimizationStatus();
    
    // Get performance metrics
    const performanceScore = performanceMonitor.getPerformanceScore();
    const performanceMetrics = performanceMonitor.getAverageMetrics();
    const allMetrics = performanceMonitor.getMetrics();
    
    const healthStatus = {
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      overall: 'healthy',
      services: {
        supabase: {
          status: supabaseHealthy.status === 'fulfilled' && supabaseHealthy.value ? 'healthy' : 'unhealthy',
          details: supabaseHealthy.status === 'rejected' ? supabaseHealthy.reason?.message : 'Connection verified',
          lastChecked: new Date().toISOString(),
        },
        stripe: {
          status: stripeHealthy.status === 'fulfilled' && stripeHealthy.value ? 'healthy' : 'unhealthy',
          details: stripeHealthy.status === 'rejected' ? stripeHealthy.reason?.message : 'API connection verified',
          lastChecked: new Date().toISOString(),
        },
        sendgrid: {
          status: sendGridHealthy.status === 'fulfilled' && sendGridHealthy.value ? 'healthy' : 'unhealthy',
          details: sendGridHealthy.status === 'rejected' ? sendGridHealthy.reason?.message : 'Email service operational',
          lastChecked: new Date().toISOString(),
          stats: emailStats,
        },
      },
      optimization: {
        isOptimized: optimizationStatus.isOptimized,
        systemHealth: systemHealth,
        cacheStats: optimizationStatus.cacheStats,
        performanceScore: performanceScore,
        config: optimizationStatus.config
      },
      performance: {
        score: performanceScore,
        averageMetrics: performanceMetrics,
        recentMetrics: allMetrics.slice(-5) // Last 5 metrics
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextjsVersion: process.env.npm_package_dependencies_next || 'unknown',
        deployment: process.env.VERCEL ? 'vercel' : 'local',
      },
    };
    
    // Determine overall health including performance score
    const unhealthyServices = Object.values(healthStatus.services).filter(
      service => service.status === 'unhealthy'
    );
    
    if (unhealthyServices.length === 0 && performanceScore >= 80) {
      healthStatus.overall = 'healthy';
    } else if (unhealthyServices.length === Object.keys(healthStatus.services).length || performanceScore < 40) {
      healthStatus.overall = 'critical';
    } else {
      healthStatus.overall = 'degraded';
    }
    
    // Return appropriate HTTP status based on health
    const httpStatus = healthStatus.overall === 'healthy' ? 200 : 
                     healthStatus.overall === 'degraded' ? 207 : 503;
    
    return NextResponse.json(healthStatus, { status: httpStatus });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      overall: 'critical',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      services: {
        supabase: { status: 'unknown', details: 'Health check failed' },
        stripe: { status: 'unknown', details: 'Health check failed' },
        sendgrid: { status: 'unknown', details: 'Health check failed' },
      },
    }, { status: 503 });
  }
}

// Optional: Add a simple ping endpoint
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}