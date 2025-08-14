import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/database';
import { signIn } from 'next-auth/react';

export async function GET(request: NextRequest) {
  console.log('🏥 Auth Health Check: Starting comprehensive authentication system check...');
  
  const healthData: any = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // 1. Environment Variables Check
    console.log('🔍 Checking environment variables...');
    healthData.checks.environment = {
      nextauth_secret: !!process.env.NEXTAUTH_SECRET,
      nextauth_url: !!process.env.NEXTAUTH_URL,
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      node_env: process.env.NODE_ENV,
      status: 'checked'
    };

    // Check for placeholder values
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const placeholderUrls = ['https://supabase.co', 'https://xyzcompany.supabase.co', 'your-project-url'];
    if (supabaseUrl && placeholderUrls.some(placeholder => supabaseUrl.includes(placeholder))) {
      healthData.checks.environment.warning = 'Supabase URL appears to be a placeholder';
    }

    // 2. Database Connection Check
    console.log('🔍 Checking database connection...');
    const dbHealth = await db.healthCheck();
    healthData.checks.database = {
      status: dbHealth.status,
      database: dbHealth.database,
      message: dbHealth.message,
      connection: dbHealth.status === 'healthy' ? 'connected' : 'failed'
    };

    // 3. NextAuth Token Check
    console.log('🔍 Checking NextAuth token system...');
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
      });
      healthData.checks.nextauth = {
        token_system: 'working',
        has_active_session: !!token,
        user_id: token?.id || null,
        user_email: token?.email || null
      };
    } catch (error) {
      console.error('❌ NextAuth token error:', error);
      healthData.checks.nextauth = {
        token_system: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        has_active_session: false
      };
    }

    // 4. Test User Creation (in-memory only for safety)
    console.log('🔍 Testing user creation system...');
    try {
      const testEmail = `health-check-${Date.now()}@example.com`;
      const testUser = await db.createUser({
        email: testEmail,
        password: 'TestPass123',
        name: 'Health Check User',
        user_role: 'user'
      });

      if (testUser) {
        healthData.checks.user_creation = {
          status: 'working',
          test_user_created: true,
          user_id: testUser.id
        };

        // Test password verification
        const passwordValid = await db.verifyPassword('TestPass123', testUser.password_hash!);
        healthData.checks.password_verification = {
          status: passwordValid ? 'working' : 'failed',
          test_passed: passwordValid
        };
      } else {
        healthData.checks.user_creation = {
          status: 'failed',
          test_user_created: false,
          error: 'User creation returned null'
        };
      }
    } catch (error) {
      console.error('❌ User creation test error:', error);
      healthData.checks.user_creation = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // 5. Admin User Check
    console.log('🔍 Checking admin user...');
    try {
      const adminUser = await db.findUserByEmail('chris.t@ventarosales.com');
      healthData.checks.admin_user = {
        exists: !!adminUser,
        email: adminUser?.email || null,
        role: adminUser?.user_role || null,
        has_password: !!adminUser?.password_hash
      };
    } catch (error) {
      healthData.checks.admin_user = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // 6. Overall Status Assessment
    const criticalChecks = [
      healthData.checks.environment.nextauth_secret,
      healthData.checks.database.status === 'healthy',
      healthData.checks.nextauth.token_system === 'working',
      healthData.checks.user_creation?.status === 'working'
    ];

    const allCriticalPassing = criticalChecks.every(check => check);
    
    healthData.status = allCriticalPassing ? 'healthy' : 'degraded';
    healthData.overall = {
      authentication_system: allCriticalPassing ? 'operational' : 'issues_detected',
      sign_up_available: healthData.checks.user_creation?.status === 'working',
      sign_in_available: healthData.checks.nextauth.token_system === 'working' && healthData.checks.database.status === 'healthy',
      recommendations: []
    };

    // Add recommendations for common issues
    if (!healthData.checks.environment.nextauth_secret) {
      healthData.overall.recommendations.push('Set NEXTAUTH_SECRET environment variable');
    }
    if (healthData.checks.database.status !== 'healthy') {
      healthData.overall.recommendations.push('Check Supabase connection and credentials');
    }
    if (healthData.checks.environment.warning) {
      healthData.overall.recommendations.push('Update Supabase URL to your actual project URL');
    }
    if (!healthData.checks.admin_user.exists) {
      healthData.overall.recommendations.push('Run database setup script to create admin user');
    }

    console.log('✅ Auth Health Check: Complete');
    console.log('📊 Overall Status:', healthData.status);
    
    return NextResponse.json(healthData, { 
      status: healthData.status === 'healthy' ? 200 : 503 
    });

  } catch (error) {
    console.error('❌ Auth Health Check: Critical error:', error);
    
    healthData.status = 'unhealthy';
    healthData.error = {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: 'critical_system_error'
    };

    return NextResponse.json(healthData, { status: 500 });
  }
} 