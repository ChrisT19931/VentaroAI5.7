import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// Verify token for guest users using session and order data
const verifyToken = (token: string, sessionId: string, orderId: string): boolean => {
  try {
    // Decode the token
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    
    // Token format: sessionId-orderId-productId
    const [tokenSessionId, tokenOrderId] = decodedToken.split('-');
    
    // Verify session and order match
    if (tokenSessionId !== sessionId || tokenOrderId !== orderId) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

export async function GET(request: NextRequest) {
  try {
    console.log('=== VIP Access Check ===');
    
    // Get cookies from the request
    const cookieStore = cookies();
    const authCookie = cookieStore.get('ventaro-auth');
    const sbAccessToken = cookieStore.get('sb-access-token');
    const sbRefreshToken = cookieStore.get('sb-refresh-token');
    
    console.log('Auth cookie present:', !!authCookie?.value);
    console.log('Supabase cookies present:', !!sbAccessToken?.value, !!sbRefreshToken?.value);
    
    // Create server-side Supabase client with cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'ventaro-store-auth-token',
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: sbAccessToken?.value ? {
          Authorization: `Bearer ${sbAccessToken.value}`,
        } : {},
      },
    });
    
    // If we have tokens, set the session manually
    if (sbAccessToken?.value && sbRefreshToken?.value) {
      await supabase.auth.setSession({
        access_token: sbAccessToken.value,
        refresh_token: sbRefreshToken.value,
      });
    }
    let hasAccess = false;
    let purchasedProducts: any[] = [];
    let purchases: any[] = [];

    let user = null;
    let isAdmin = false;
    
    // Try to get user from session first
    try {
      const { data: { user: sessionUser }, error } = await supabase.auth.getUser();
      user = sessionUser;
      console.log('GET verify-vip-access - Session User:', user?.email, 'Error:', error);
    } catch (sessionError) {
      console.log('Session error:', sessionError);
    }
    
    // If no user session but ventaro-auth cookie is present, check admin users directly
    if (!user && authCookie?.value === 'true') {
      console.log('No Supabase session but ventaro-auth cookie present, checking admin users');
      
      try {
        const { supabaseAdmin } = await import('@/lib/supabase');
        if (supabaseAdmin) {
          const { data: adminUsers, error: adminError } = await supabaseAdmin.auth.admin.listUsers();
          
          if (adminError) {
            console.error('Error fetching admin users:', adminError);
          } else {
            // Check if any admin user matches our expected admin email
            const adminEmail = 'chris.t@ventarosales.com';
            const adminUser = adminUsers?.users?.find((u: any) => 
              u.email === adminEmail && u.user_metadata?.is_admin === true
            );
            
            if (adminUser) {
              console.log('Found admin user via direct lookup:', adminUser.email);
              user = adminUser as any; // Cast for compatibility
              isAdmin = true;
            }
          }
        } else {
          console.log('Admin client not available - check SUPABASE_SERVICE_ROLE_KEY');
        }
      } catch (adminCheckError) {
        console.error('Error checking admin users:', adminCheckError);
      }
    }
    
    // If still no user found, return no access
    if (!user) {
      console.log('No user found, returning no access');
      return NextResponse.json({ 
        hasAccess: false, 
        isAdmin: false, 
        purchases: [] 
      });
    }
    
    // Check if user is admin (if not already determined)
     if (!isAdmin) {
       const adminEmail = 'chris.t@ventarosales.com';
       isAdmin = user.user_metadata?.is_admin === true || user.email === adminEmail;
     }
     
     console.log('User metadata:', user.user_metadata);
     console.log('Is admin check:', isAdmin);
    
    const userId = user.id;

    // Check if user is authenticated and is admin
    if (userId && isAdmin) {
      console.log('Admin user detected, granting full access');
      // Admin users have VIP access and can access all products
      return NextResponse.json({ 
        hasAccess: true, 
        isAdmin: true,
        purchases: [
          { id: '1', name: 'AI Tools Mastery Guide 2025', fileName: 'ai-tools-mastery-guide-2025.pdf' },
          { id: '2', name: 'AI Prompts Arsenal 2025', fileName: 'ai-prompts-collection.pdf' },
          { id: '3', name: 'AI Business Strategy Session 2025', fileName: 'coaching-materials.pdf' }
        ]
      });
    }

    // For authenticated users, check their purchases
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        created_at,
        order_items!inner (
          id,
          price,
          products!inner (
            id,
            name,
            file_name
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (!ordersError && orders && orders.length > 0) {
      hasAccess = true;
      purchases = orders.flatMap(order => 
        order.order_items?.map((item: any) => ({
          id: item.products?.id,
          name: item.products?.name,
          fileName: item.products?.file_name,
          purchaseDate: order.created_at,
          price: item.price
        })) || []
      );
    }

    // Add default file names if missing
    purchases = purchases.map(purchase => ({
      ...purchase,
      fileName: purchase.fileName || getDefaultFileName(purchase.name)
    }));

    return NextResponse.json({ 
      hasAccess, 
      purchases: purchases.filter(p => p.name) // Filter out any invalid entries
    });
  } catch (error) {
    console.error('Verify VIP access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, guestEmail, orderToken, sessionId, orderId } = await request.json();
    
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    let hasAccess = false;
    let purchasedProducts: any[] = [];
    let purchases: any[] = [];

    // Check if user is authenticated and is admin
    if (userId) {
      // Get user data to check metadata
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const adminEmail = 'chris.t@ventarosales.com';
      
      if (!userError && (user?.user_metadata?.is_admin === true || user?.email === adminEmail)) {
        // Admin users have VIP access and can access all products
        return NextResponse.json({ 
          hasAccess: true, 
          purchasedProducts: [
            { name: 'AI Tools Mastery Guide 2025', fileName: 'ai-tools-mastery-guide-2025.pdf' },
            { name: 'AI Prompts Arsenal 2025', fileName: 'ai-prompts-collection.pdf' },
            { name: 'AI Business Strategy Session 2025', fileName: 'coaching-materials.pdf' }
          ]
        });
      }
    }

    // For authenticated users
    if (userId) {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          created_at,
          order_items!inner (
            id,
            price,
            products!inner (
              id,
              name,
              file_name
            )
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (!ordersError && orders && orders.length > 0) {
        hasAccess = true;
        purchases = orders.flatMap(order => 
          order.order_items?.map((item: any) => ({
            name: item.products?.name,
            fileName: item.products?.file_name,
            purchaseDate: order.created_at,
            price: item.price
          })) || []
        );
      }
    }
    // For guest users with valid token
    else if (guestEmail && orderToken && sessionId && orderId) {
      // Verify the token
      const isValidToken = verifyToken(orderToken, sessionId, orderId);
      
      if (!isValidToken) {
        return NextResponse.json({ hasAccess: false, purchases: [] });
      }

      // Check if the specific order exists and is completed
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          created_at,
          customer_email,
          order_items!inner (
            id,
            price,
            products!inner (
              id,
              name,
              file_name
            )
          )
        `)
        .eq('id', orderId)
        .eq('status', 'completed')
        .eq('customer_email', guestEmail);

      if (!ordersError && orders && orders.length > 0) {
        hasAccess = true;
        purchases = orders.flatMap(order => 
          order.order_items?.map((item: any) => ({
            name: item.products?.name,
            fileName: item.products?.file_name,
            purchaseDate: order.created_at,
            price: item.price
          })) || []
        );
      }
    }

    // Add default file names if missing
    purchases = purchases.map(purchase => ({
      ...purchase,
      fileName: purchase.fileName || getDefaultFileName(purchase.name)
    }));

    return NextResponse.json({ 
      hasAccess, 
      purchases: purchases.filter(p => p.name) // Filter out any invalid entries
    });
  } catch (error) {
    console.error('Verify VIP access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get default file names
function getDefaultFileName(productName: string): string {
  if (productName?.includes('AI Tools Mastery Guide')) {
    return 'ai-tools-mastery-guide-2025.pdf';
  } else if (productName?.includes('AI Prompts')) {
    return 'ai-prompts-collection.pdf';
  } else if (productName?.includes('Coaching') || productName?.includes('Strategy Session')) {
    return 'coaching-session-info.pdf';
  }
  return 'product-download.pdf';
}