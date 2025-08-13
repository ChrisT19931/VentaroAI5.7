import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  console.log('🔍 Running authentication system health check...');
  
  const healthData = {
    timestamp: new Date().toISOString(),
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    checks: {
      database: { status: 'unknown', message: '', duration: 0 },
      authentication: { status: 'unknown', message: '', duration: 0 },
      environment: { status: 'unknown', message: '', duration: 0 },
      testLogin: { status: 'unknown', message: '', duration: 0 }
    },
    summary: {
      totalUsers: 0,
      totalPurchases: 0,
      adminUsers: 0,
      databaseType: 'unknown'
    }
  };

  try {
    // 1. Database Health Check
    console.log('🔍 Checking database health...');
    const dbStart = Date.now();
    const dbHealth = await db.healthCheck();
    healthData.checks.database = {
      status: dbHealth.status,
      message: dbHealth.message,
      duration: Date.now() - dbStart
    };
    healthData.summary.databaseType = dbHealth.database;

    // 2. Environment Variables Check
    console.log('🔍 Checking environment variables...');
    const envStart = Date.now();
    const requiredEnvVars = [
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_SITE_URL'
    ];
    
    const optionalEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SENDGRID_API_KEY',
      'EMAIL_FROM'
    ];

    const missingRequired = requiredEnvVars.filter(key => !process.env[key]);
    const missingOptional = optionalEnvVars.filter(key => !process.env[key]);

    if (missingRequired.length > 0) {
      healthData.checks.environment = {
        status: 'unhealthy',
        message: `Missing required environment variables: ${missingRequired.join(', ')}`,
        duration: Date.now() - envStart
      };
    } else if (missingOptional.length > 0) {
      healthData.checks.environment = {
        status: 'degraded',
        message: `Missing optional environment variables: ${missingOptional.join(', ')} (using fallbacks)`,
        duration: Date.now() - envStart
      };
    } else {
      healthData.checks.environment = {
        status: 'healthy',
        message: 'All environment variables configured',
        duration: Date.now() - envStart
      };
    }

    // 3. Authentication Token Check
    console.log('🔍 Checking authentication system...');
    const authStart = Date.now();
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development' 
      });
      
      if (token) {
        healthData.checks.authentication = {
          status: 'healthy',
          message: `Valid token found for user: ${token.email}`,
          duration: Date.now() - authStart
        };
      } else {
        healthData.checks.authentication = {
          status: 'healthy',
          message: 'No active session (expected for unauthenticated request)',
          duration: Date.now() - authStart
        };
      }
    } catch (authError) {
      healthData.checks.authentication = {
        status: 'degraded',
        message: `Authentication system accessible but no valid session: ${authError}`,
        duration: Date.now() - authStart
      };
    }

    // 4. Test User Login Check
    console.log('🔍 Testing user authentication...');
    const loginStart = Date.now();
    try {
      const testUser = await db.findUserByEmail('admin@ventaro.ai');
      if (testUser) {
        const isValidPassword = await db.verifyPassword('admin123', testUser.password_hash || '');
        healthData.checks.testLogin = {
          status: isValidPassword ? 'healthy' : 'degraded',
          message: isValidPassword ? 
            'Test admin user login successful' : 
            'Test admin user found but password verification failed',
          duration: Date.now() - loginStart
        };
      } else {
        healthData.checks.testLogin = {
          status: 'degraded',
          message: 'Test admin user not found (will be created on next auth attempt)',
          duration: Date.now() - loginStart
        };
      }
    } catch (loginError) {
      healthData.checks.testLogin = {
        status: 'unhealthy',
        message: `Test login failed: ${loginError}`,
        duration: Date.now() - loginStart
      };
    }

    // 5. Collect System Summary (if database is healthy)
    if (dbHealth.status === 'healthy') {
      try {
        // Count users by role
        if (dbHealth.database === 'supabase') {
          // For Supabase, we'd need to implement these queries
          healthData.summary.totalUsers = 0; // Placeholder
          healthData.summary.adminUsers = 0; // Placeholder
          healthData.summary.totalPurchases = 0; // Placeholder
        } else {
          // For in-memory storage, we can count directly
          const adminUser = await db.findUserByEmail('admin@ventaro.ai');
          const testUser = await db.findUserByEmail('test@example.com');
          
          healthData.summary.totalUsers = [adminUser, testUser].filter(Boolean).length;
          healthData.summary.adminUsers = adminUser ? 1 : 0;
          
          // Count purchases for admin user
          if (adminUser) {
            const purchases = await db.getUserPurchases(adminUser.id);
            healthData.summary.totalPurchases = purchases.length;
          }
        }
      } catch (summaryError) {
        console.warn('⚠️ Error collecting system summary:', summaryError);
      }
    }

    // 6. Determine Overall Status
    const statuses = Object.values(healthData.checks).map(check => check.status);
    if (statuses.includes('unhealthy')) {
      healthData.status = 'unhealthy';
    } else if (statuses.includes('degraded')) {
      healthData.status = 'degraded';
    } else {
      healthData.status = 'healthy';
    }

    console.log(`✅ Health check completed - Status: ${healthData.status}`);

    return NextResponse.json(healthData, { 
      status: healthData.status === 'unhealthy' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: any) {
    console.error('❌ Health check error:', error);
    
    healthData.status = 'unhealthy';
    healthData.checks = {
      database: { status: 'unhealthy', message: `Critical error: ${error.message}`, duration: 0 },
      authentication: { status: 'unknown', message: 'Not checked due to critical error', duration: 0 },
      environment: { status: 'unknown', message: 'Not checked due to critical error', duration: 0 },
      testLogin: { status: 'unknown', message: 'Not checked due to critical error', duration: 0 }
    };

    return NextResponse.json(healthData, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
} 