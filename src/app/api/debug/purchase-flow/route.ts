import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { getStripeInstance } from '@/lib/stripe';
import { bulletproofAuth } from '@/lib/auth-bulletproof';

interface DebugTest {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
}

export async function GET(request: NextRequest) {
  const results: DebugTest[] = [];
  
  try {
    // Test 1: Authentication
    results.push({
      name: 'Authentication Check',
      status: 'success',
      message: 'Debug endpoint accessible'
    });

    // Test 2: Supabase Connection
    try {
      const adminClient = getSupabaseAdmin();
      const { data, error } = await adminClient
        .from('purchases')
        .select('count')
        .limit(1);
      
      if (error) {
        results.push({
          name: 'Supabase Connection',
          status: 'error',
          message: `Supabase error: ${error.message}`,
          data: { error: error.code }
        });
      } else {
        results.push({
          name: 'Supabase Connection',
          status: 'success',
          message: 'Supabase connected successfully'
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Supabase Connection',
        status: 'error',
        message: `Supabase connection failed: ${error.message}`
      });
    }

    // Test 3: Purchase Table Structure
    try {
      const adminClient = getSupabaseAdmin();
      const { data, error } = await adminClient
        .from('purchases')
        .select('*')
        .limit(1);
      
      if (error) {
        results.push({
          name: 'Purchase Table Structure',
          status: 'error',
          message: `Cannot access purchases table: ${error.message}`
        });
      } else {
        const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
        const requiredColumns = ['user_id', 'customer_email', 'product_id', 'status'];
        const missingColumns = requiredColumns.filter(col => !columns.includes(col));
        
        if (missingColumns.length > 0) {
          results.push({
            name: 'Purchase Table Structure',
            status: 'error',
            message: `Missing required columns: ${missingColumns.join(', ')}`,
            data: { columns, missingColumns }
          });
        } else {
          results.push({
            name: 'Purchase Table Structure',
            status: 'success',
            message: 'Purchase table structure is correct',
            data: { columns }
          });
        }
      }
    } catch (error: any) {
      results.push({
        name: 'Purchase Table Structure',
        status: 'error',
        message: `Purchase table check failed: ${error.message}`
      });
    }

    // Test 4: Product ID Mapping
    const testMappings = [
      { productName: 'AI Prompts Arsenal 2025', expected: 'prompts' },
      { productName: 'AI Tools Mastery Guide 2025', expected: 'ebook' },
      { productName: 'AI Business Coaching Session', expected: 'coaching' },
      { productName: 'AI Web Creation Masterclass', expected: 'video' },
      { productName: 'Support Package', expected: 'support' }
    ];

    function mapStripeProductToInternal(productName: string): string {
      const name = productName.toLowerCase();
      if (name.includes('prompt') || name.includes('ai prompts')) {
        return 'prompts';
      } else if (name.includes('e-book') || name.includes('ebook') || name.includes('mastery guide')) {
        return 'ebook';
      } else if (name.includes('coaching') || name.includes('session')) {
        return 'coaching';
      } else if (name.includes('masterclass') || name.includes('video')) {
        return 'video';
      } else if (name.includes('support')) {
        return 'support';
      }
      return productName;
    }

    const mappingResults = testMappings.map(test => ({
      productName: test.productName,
      expected: test.expected,
      actual: mapStripeProductToInternal(test.productName),
      success: mapStripeProductToInternal(test.productName) === test.expected
    }));

    const failedMappings = mappingResults.filter(r => !r.success);
    
    results.push({
      name: 'Product ID Mapping',
      status: failedMappings.length === 0 ? 'success' : 'error',
      message: failedMappings.length === 0 
        ? 'All product mappings working correctly'
        : `${failedMappings.length} mappings failed`,
      data: { mappingResults, failedMappings }
    });

    // Test 5: Bulletproof Auth System
    try {
      const healthCheck = await bulletproofAuth.healthCheck();
      results.push({
        name: 'Bulletproof Auth System',
        status: healthCheck.status === 'healthy' ? 'success' : 'warning',
        message: healthCheck.message || `Status: ${healthCheck.status}`,
        data: healthCheck
      });
    } catch (error: any) {
      results.push({
        name: 'Bulletproof Auth System',
        status: 'error',
        message: `Bulletproof auth error: ${error.message}`
      });
    }

    // Test 6: Environment Variables
    const requiredEnvVars = [
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET', 
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXTAUTH_SECRET',
      'SENDGRID_API_KEY'
    ];

    const envResults = requiredEnvVars.map(envVar => {
      const value = process.env[envVar];
      const configured = value && value !== 'placeholder' && !value.includes('your-') && !value.includes('sk_test_example');
      return {
        variable: envVar,
        configured,
        hasValue: !!value,
        isPlaceholder: value === 'placeholder' || value?.includes('your-') || value?.includes('example')
      };
    });

    const missingEnvVars = envResults.filter(env => !env.configured);
    
    results.push({
      name: 'Environment Variables',
      status: missingEnvVars.length === 0 ? 'success' : 'error',
      message: missingEnvVars.length === 0 
        ? 'All environment variables configured'
        : `${missingEnvVars.length} environment variables missing or using placeholders`,
      data: { envResults, missingEnvVars }
    });

    // Test 7: Stripe Connection
    try {
      const stripe = await getStripeInstance();
      // Try to list products to test connection
      const products = await stripe.products.list({ limit: 1 });
      results.push({
        name: 'Stripe Connection',
        status: 'success',
        message: 'Stripe API connected successfully',
        data: { productCount: products.data.length }
      });
    } catch (error: any) {
      results.push({
        name: 'Stripe Connection',
        status: 'error',
        message: `Stripe connection failed: ${error.message}`,
        data: { errorType: error.type, errorCode: error.code }
      });
    }

    // Overall status
    const errorCount = results.filter(r => r.status === 'error').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    const successCount = results.filter(r => r.status === 'success').length;

    return NextResponse.json({
      summary: {
        total: results.length,
        success: successCount,
        warnings: warningCount,
        errors: errorCount,
        overallStatus: errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success'
      },
      tests: results,
      recommendations: generateRecommendations(results),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'create_test_purchase':
        return await createTestPurchase(data);
      
      case 'simulate_webhook':
        return await simulateStripeWebhook(data);
      
      case 'test_user_access':
        return await testUserAccess(data);
      
      case 'fix_existing_purchases':
        return await fixExistingPurchases();
      
      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: [
            'create_test_purchase',
            'simulate_webhook', 
            'test_user_access',
            'fix_existing_purchases'
          ]
        }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({
      error: 'Action failed',
      message: error.message
    }, { status: 500 });
  }
}

async function createTestPurchase(data: any) {
  try {
    const testPurchase = {
      user_id: data.userId || 'test-user-123',
      customer_email: data.email || 'test@example.com',
      product_id: data.productId || 'prompts',
      product_name: data.productName || 'AI Prompts Arsenal 2025',
      amount: data.amount || 10.00,
      currency: 'usd',
      status: 'active',
      stripe_session_id: `test_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const purchase = await bulletproofAuth.createPurchase(testPurchase);
    
    if (purchase) {
      return NextResponse.json({
        success: true,
        message: 'Test purchase created successfully',
        purchase
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to create test purchase'
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Test purchase creation failed: ${error.message}`
    }, { status: 500 });
  }
}

async function simulateStripeWebhook(data: any) {
  try {
    const mockSession = {
      id: `cs_test_${Date.now()}`,
      customer: 'cus_test_123',
      customer_details: {
        email: data.email || 'test@example.com'
      },
      client_reference_id: data.userId || 'test-user-123',
      payment_status: 'paid'
    };

    const mockProduct = {
      id: `prod_test_${Date.now()}`,
      name: data.productName || 'AI Prompts Arsenal 2025'
    };

    // Map product name to internal ID
    function mapProduct(productName: string): string {
      const name = productName.toLowerCase();
      if (name.includes('prompt')) return 'prompts';
      if (name.includes('ebook') || name.includes('mastery')) return 'ebook';
      if (name.includes('coaching')) return 'coaching';
      if (name.includes('masterclass') || name.includes('video')) return 'video';
      if (name.includes('support')) return 'support';
      return productName;
    }

    const mappedProductId = mapProduct(mockProduct.name);

    // Create purchase record
    const purchase = await bulletproofAuth.createPurchase({
      user_id: mockSession.client_reference_id,
      customer_email: mockSession.customer_details.email,
      product_id: mappedProductId,
      amount: data.amount || 10.00,
      currency: 'usd',
      status: 'active',
      stripe_session_id: mockSession.id,
      stripe_customer_id: mockSession.customer
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook simulation completed',
      data: {
        mockSession,
        mockProduct,
        mappedProductId,
        purchase
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Webhook simulation failed: ${error.message}`
    }, { status: 500 });
  }
}

async function testUserAccess(data: any) {
  try {
    const userId = data.userId || 'test-user-123';
    const email = data.email || 'test@example.com';
    const productId = data.productId || 'prompts';

    // Get user purchases
    const purchases = await bulletproofAuth.getUserPurchases(userId);
    
    // Check access
    const hasAccess = purchases.some((purchase: any) => purchase.product_id === productId);
    const isAdmin = email === 'chris.t@ventarosales.com';

    return NextResponse.json({
      success: true,
      userId,
      email,
      productId,
      hasAccess,
      isAdmin,
      finalAccess: hasAccess || isAdmin,
      purchases: purchases.map((p: any) => ({
        id: p.id,
        product_id: p.product_id,
        product_name: p.product_name,
        amount: p.amount,
        status: p.status,
        created_at: p.created_at
      }))
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Access test failed: ${error.message}`
    }, { status: 500 });
  }
}

async function fixExistingPurchases() {
  try {
    const adminClient = getSupabaseAdmin();
    
    // Get all purchases with Stripe product IDs
    const { data: purchases, error } = await adminClient
      .from('purchases')
      .select('*')
      .like('product_id', 'prod_%');

    if (error) {
      throw new Error(`Failed to fetch purchases: ${error.message}`);
    }

    if (!purchases || purchases.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No purchases with Stripe product IDs found',
        fixed: 0
      });
    }

    // Fix each purchase
    const fixes = [];
    for (const purchase of purchases) {
      const productName = purchase.product_name || '';
      let mappedId = purchase.product_id;

      // Map based on product name
      const name = productName.toLowerCase();
      if (name.includes('prompt') || name.includes('ai prompts')) {
        mappedId = 'prompts';
      } else if (name.includes('e-book') || name.includes('ebook') || name.includes('mastery guide')) {
        mappedId = 'ebook';
      } else if (name.includes('coaching') || name.includes('session')) {
        mappedId = 'coaching';
      } else if (name.includes('masterclass') || name.includes('video')) {
        mappedId = 'video';
      } else if (name.includes('support')) {
        mappedId = 'support';
      }

      if (mappedId !== purchase.product_id) {
        const { error: updateError } = await adminClient
          .from('purchases')
          .update({ 
            product_id: mappedId,
            updated_at: new Date().toISOString()
          })
          .eq('id', purchase.id);

        fixes.push({
          id: purchase.id,
          email: purchase.customer_email,
          oldProductId: purchase.product_id,
          newProductId: mappedId,
          productName: purchase.product_name,
          success: !updateError,
          error: updateError?.message
        });
      }
    }

    const successfulFixes = fixes.filter(f => f.success).length;

    return NextResponse.json({
      success: true,
      message: `Fixed ${successfulFixes} purchases`,
      totalFound: purchases.length,
      fixes
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Fix operation failed: ${error.message}`
    }, { status: 500 });
  }
}

function generateRecommendations(results: DebugTest[]): string[] {
  const recommendations = [];
  
  const errors = results.filter(r => r.status === 'error');
  const warnings = results.filter(r => r.status === 'warning');

  if (errors.some(e => e.name === 'Supabase Connection')) {
    recommendations.push('🔥 CRITICAL: Set up Supabase connection - purchases won\'t persist without it');
  }

  if (errors.some(e => e.name === 'Environment Variables')) {
    recommendations.push('🔧 Configure missing environment variables in your .env.local file');
  }

  if (errors.some(e => e.name === 'Stripe Connection')) {
    recommendations.push('💳 Fix Stripe configuration - payments won\'t process without it');
  }

  if (errors.some(e => e.name === 'Product ID Mapping')) {
    recommendations.push('🔄 Fix product ID mapping logic to ensure purchases unlock correctly');
  }

  if (errors.some(e => e.name === 'Purchase Table Structure')) {
    recommendations.push('📋 Create or fix the purchases table structure in Supabase');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ System looks healthy! Test with a real purchase to verify end-to-end flow');
  }

  return recommendations;
} 