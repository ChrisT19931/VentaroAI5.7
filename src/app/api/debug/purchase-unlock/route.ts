import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { bulletproofAuth } from '@/lib/auth-bulletproof';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    if (!email && !userId) {
      return NextResponse.json({
        error: 'Email or userId is required'
      }, { status: 400 });
    }

    // Get user's current purchases
    const adminClient = getSupabaseAdmin();
    
    let query = adminClient
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (email) {
      query = query.eq('customer_email', email);
    }

    const { data: purchases, error } = await query;

    if (error) {
      return NextResponse.json({
        error: 'Failed to fetch purchases',
        details: error.message
      }, { status: 500 });
    }

    // Check access for specific product if requested
    let hasAccess = false;
    if (productId) {
      hasAccess = purchases?.some(p => p.product_id === productId) || false;
    }

    // Get user info
    let userInfo = null;
    if (userId) {
      const { data: user } = await adminClient.auth.admin.getUserById(userId);
      userInfo = user?.user;
    }

    return NextResponse.json({
      success: true,
      userInfo: userInfo ? {
        id: userInfo.id,
        email: userInfo.email,
        created_at: userInfo.created_at
      } : null,
      searchCriteria: { email, userId, productId },
      hasAccess: productId ? hasAccess : null,
      purchases: purchases?.map(p => ({
        id: p.id,
        product_id: p.product_id,
        product_name: p.product_name,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        stripe_session_id: p.stripe_session_id,
        created_at: p.created_at
      })) || [],
      totalPurchases: purchases?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to check purchase unlock status',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { action } = body;

    // Allow auto-unlock from success page without admin auth
    if (action === 'auto_unlock_from_success') {
      return await handleAutoUnlockFromSuccess(body);
    }

    // Only allow admin users to perform other POST actions
    if (!session?.user?.email || session.user.email !== 'chris.t@ventarosales.com') {
      return NextResponse.json({
        error: 'Unauthorized - Admin access required'
      }, { status: 401 });
    }

    switch (action) {
      case 'manual_unlock':
        return await handleManualUnlock(body);
      case 'fix_user_purchases':
        return await handleFixUserPurchases(body);
      case 'simulate_purchase':
        return await handleSimulatePurchase(body);
      case 'verify_access':
        return await handleVerifyAccess(body);
      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: ['manual_unlock', 'fix_user_purchases', 'simulate_purchase', 'verify_access', 'auto_unlock_from_success']
        }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({
      error: 'POST action failed',
      message: error.message
    }, { status: 500 });
  }
}

async function handleAutoUnlockFromSuccess(body: any) {
  const { session_id, force_unlock } = body;

  if (!session_id) {
    return NextResponse.json({
      error: 'Session ID is required for auto unlock'
    }, { status: 400 });
  }

  try {
    // Get Stripe session details
    const stripe = await import('stripe').then(m => new m.default(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    }));

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'line_items.data.price.product']
    });

    if (!session.customer_details?.email) {
      return NextResponse.json({
        error: 'No customer email found in session'
      }, { status: 400 });
    }

    const customerEmail = session.customer_details.email;
    const userId = session.client_reference_id;
    const lineItems = session.line_items?.data || [];

    let unlockedProducts: any[] = [];
    let errors: any[] = [];

    // Process each purchased item
    for (const item of lineItems) {
      try {
        const price = item.price;
        const product = price?.product;
        
        if (!price || !product || typeof product === 'string') {
          continue;
        }

        // Map Stripe product to internal product ID
        const productName = product.name;
        let mappedProductId = 'unknown';
        
        const name = productName.toLowerCase();
        if (name.includes('prompt') || name.includes('ai prompts') || name.includes('arsenal')) {
          mappedProductId = 'prompts';
        } else if (name.includes('e-book') || name.includes('ebook') || name.includes('mastery guide') || name.includes('tools guide')) {
          mappedProductId = 'ebook';
        } else if (name.includes('coaching') || name.includes('session') || name.includes('consultation')) {
          mappedProductId = 'coaching';
        } else if (name.includes('masterclass') || name.includes('video') || name.includes('web creation')) {
          mappedProductId = 'video';
        } else if (name.includes('support') || name.includes('package')) {
          mappedProductId = 'support';
        }

        const purchaseData = {
          user_id: userId || null,
          customer_email: customerEmail,
          product_id: mappedProductId,
          product_name: productName,
          price_id: price.id,
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          currency: price.currency,
          status: 'active' as const,
          stripe_session_id: session_id,
          stripe_customer_id: session.customer,
          stripe_product_id: typeof product === 'string' ? product : product.id,
          created_at: new Date().toISOString()
        };

        // Try to create purchase record
        let purchase = null;
        try {
          purchase = await bulletproofAuth.createPurchase(purchaseData);
        } catch (error: any) {
          console.log('Bulletproof auth failed, trying direct Supabase:', error.message);
        }

        // Fallback to direct Supabase
        if (!purchase) {
          try {
            const { data, error } = await supabase
              .from('purchases')
              .insert([{
                ...purchaseData,
                id: `auto_unlock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              }])
              .select()
              .single();

            if (error) {
              console.error('Direct Supabase creation failed:', error);
            } else {
              purchase = data;
            }
          } catch (supabaseError) {
            console.error('Supabase fallback failed:', supabaseError);
          }
        }

        if (purchase) {
          unlockedProducts.push({
            product_id: mappedProductId,
            product_name: productName,
            purchase_id: purchase.id,
            amount: purchaseData.amount
          });
        } else {
          errors.push({
            product_name: productName,
            error: 'Failed to create purchase record'
          });
        }

      } catch (itemError: any) {
        errors.push({
          product_name: item.description || 'Unknown Product',
          error: itemError.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Auto unlock completed for ${customerEmail}`,
      unlocked_products: unlockedProducts,
      errors: errors.length > 0 ? errors : null,
      session_id: session_id,
      customer_email: customerEmail,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Auto unlock failed',
      message: error.message,
      session_id: session_id
    }, { status: 500 });
  }
}

async function handleManualUnlock(body: any) {
  const { email, userId, productId, productName, amount } = body;

  if (!email || !productId) {
    return NextResponse.json({
      error: 'Email and productId are required for manual unlock'
    }, { status: 400 });
  }

  try {
    const purchaseData = {
      user_id: userId || null,
      customer_email: email,
      product_id: productId,
      product_name: productName || `Manual unlock for ${productId}`,
      amount: amount || 0,
      currency: 'usd',
      status: 'active' as const,
      stripe_session_id: `manual_unlock_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    // Try bulletproof auth first
    let purchase = null;
    try {
      purchase = await bulletproofAuth.createPurchase(purchaseData);
    } catch (error: any) {
      console.log('Bulletproof auth failed, trying direct Supabase:', error.message);
    }

    // Fallback to direct Supabase
    if (!purchase) {
      const adminClient = getSupabaseAdmin();
      const { data, error } = await adminClient
        .from('purchases')
        .insert([purchaseData])
        .select()
        .single();

      if (error) {
        throw new Error(`Direct Supabase insert failed: ${error.message}`);
      }
      purchase = data;
    }

    return NextResponse.json({
      success: true,
      message: `Product ${productId} manually unlocked for ${email}`,
      purchase: {
        id: purchase.id,
        product_id: purchase.product_id,
        customer_email: purchase.customer_email,
        amount: purchase.amount,
        created_at: purchase.created_at
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Manual unlock failed',
      message: error.message
    }, { status: 500 });
  }
}

async function handleFixUserPurchases(body: any) {
  const { email, userId } = body;

  if (!email && !userId) {
    return NextResponse.json({
      error: 'Email or userId is required'
    }, { status: 400 });
  }

  try {
    const adminClient = getSupabaseAdmin();
    
    // Get all purchases for this user
    let query = adminClient
      .from('purchases')
      .select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('customer_email', email);
    }

    const { data: purchases, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch purchases: ${error.message}`);
    }

    if (!purchases || purchases.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No purchases found to fix',
        fixes: []
      });
    }

    const fixes = [];

    for (const purchase of purchases) {
      let needsUpdate = false;
      const updates: any = {};

      // Fix product ID mapping if it looks like a Stripe product ID
      if (purchase.product_id?.startsWith('prod_')) {
        const productName = purchase.product_name?.toLowerCase() || '';
        let mappedId = purchase.product_id;

        if (productName.includes('prompt') || productName.includes('arsenal')) {
          mappedId = 'prompts';
        } else if (productName.includes('ebook') || productName.includes('mastery') || productName.includes('guide')) {
          mappedId = 'ebook';
        } else if (productName.includes('coaching') || productName.includes('session')) {
          mappedId = 'coaching';
        } else if (productName.includes('masterclass') || productName.includes('video')) {
          mappedId = 'video';
        } else if (productName.includes('support')) {
          mappedId = 'support';
        }

        if (mappedId !== purchase.product_id) {
          updates.product_id = mappedId;
          needsUpdate = true;
        }
      }

      // Ensure status is active
      if (purchase.status !== 'active') {
        updates.status = 'active';
        needsUpdate = true;
      }

      // Update if needed
      if (needsUpdate) {
        const { error: updateError } = await adminClient
          .from('purchases')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', purchase.id);

        fixes.push({
          purchaseId: purchase.id,
          oldProductId: purchase.product_id,
          newProductId: updates.product_id || purchase.product_id,
          oldStatus: purchase.status,
          newStatus: updates.status || purchase.status,
          success: !updateError,
          error: updateError?.message
        });
      }
    }

    const successfulFixes = fixes.filter(f => f.success).length;

    return NextResponse.json({
      success: true,
      message: `Fixed ${successfulFixes} purchases for ${email || userId}`,
      totalPurchases: purchases.length,
      fixesApplied: fixes.length,
      fixes
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Fix purchases failed',
      message: error.message
    }, { status: 500 });
  }
}

async function handleSimulatePurchase(body: any) {
  const { email, userId, productName, amount } = body;

  if (!email || !productName) {
    return NextResponse.json({
      error: 'Email and productName are required for purchase simulation'
    }, { status: 400 });
  }

  try {
    // Map product name to internal ID
    function mapProductName(name: string): string {
      const lower = name.toLowerCase();
      if (lower.includes('prompt') || lower.includes('arsenal')) return 'prompts';
      if (lower.includes('ebook') || lower.includes('mastery') || lower.includes('guide')) return 'ebook';
      if (lower.includes('coaching') || lower.includes('session')) return 'coaching';
      if (lower.includes('masterclass') || lower.includes('video')) return 'video';
      if (lower.includes('support')) return 'support';
      return 'test';
    }

    const productId = mapProductName(productName);

    // Simulate the entire webhook flow
    const mockSession = {
      id: `cs_test_${Date.now()}`,
      customer: 'cus_test_123',
      customer_details: { email },
      client_reference_id: userId,
      payment_status: 'paid'
    };

    const mockProduct = {
      id: `prod_test_${Date.now()}`,
      name: productName,
      metadata: {}
    };

    const purchaseData = {
      user_id: userId,
      customer_email: email,
      product_id: productId,
      product_name: productName,
      amount: amount || 10.00,
      currency: 'usd',
              status: 'active' as const,
      stripe_session_id: mockSession.id,
      stripe_customer_id: mockSession.customer,
      stripe_product_id: mockProduct.id
    };

    // Create purchase
    const purchase = await bulletproofAuth.createPurchase(purchaseData);

    if (!purchase) {
      throw new Error('Purchase creation failed');
    }

    return NextResponse.json({
      success: true,
      message: `Simulated purchase of "${productName}" for ${email}`,
      simulation: {
        mockSession,
        mockProduct,
        mappedProductId: productId,
        purchase: {
          id: purchase.id,
          product_id: purchase.product_id,
          customer_email: purchase.customer_email,
          amount: purchase.amount
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Purchase simulation failed',
      message: error.message
    }, { status: 500 });
  }
}

async function handleVerifyAccess(body: any) {
  const { email, userId, productId } = body;

  if (!productId || (!email && !userId)) {
    return NextResponse.json({
      error: 'ProductId and (email or userId) are required'
    }, { status: 400 });
  }

  try {
    // Get user purchases
    const purchases = await bulletproofAuth.getUserPurchases(userId || email);
    
    // Check access
    const hasAccess = purchases.some((p: any) => p.product_id === productId);
    const isAdmin = email === 'chris.t@ventarosales.com';
    const finalAccess = hasAccess || isAdmin;

    // Get download page URL
    const downloadUrls = {
      prompts: '/downloads/prompts',
      ebook: '/downloads/ebook', 
      coaching: '/downloads/coaching',
      video: '/products/ai-web-creation-masterclass/video',
      support: '/content/support-package'
    };

    return NextResponse.json({
      success: true,
      verification: {
        email,
        userId,
        productId,
        hasAccess,
        isAdmin,
        finalAccess,
        downloadUrl: downloadUrls[productId as keyof typeof downloadUrls] || '/my-account',
        purchases: purchases.map((p: any) => ({
          id: p.id,
          product_id: p.product_id,
          product_name: p.product_name,
          amount: p.amount,
          created_at: p.created_at
        }))
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Access verification failed',
      message: error.message
    }, { status: 500 });
  }
} 