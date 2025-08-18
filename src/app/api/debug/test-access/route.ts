import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { bulletproofAuth } from '@/lib/auth-bulletproof';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 TEST ACCESS: Starting access test...');
    
    // Get current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        message: 'No active session found',
        redirectTo: '/signin'
      });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const sessionEntitlements = session.user.entitlements || [];

    console.log(`🧪 TEST ACCESS: Testing access for user ${userId} (${userEmail})`);

    // Get fresh purchases from database
    const purchases = await bulletproofAuth.getUserPurchases(userId);
    const purchasesByEmail = await bulletproofAuth.getUserPurchasesByEmail(userEmail);

    // Test product access
    const productTests = [
      { id: 'ebook', name: 'AI Tools Mastery Guide', requiredEntitlements: ['ebook', '1', 'ai-tools-mastery-guide-2025'] },
      { id: 'prompts', name: 'AI Prompts Arsenal', requiredEntitlements: ['prompts', '2', 'ai-prompts-arsenal-2025'] },
      { id: 'video', name: 'AI Web Creation Masterclass', requiredEntitlements: ['video', '4', 'ai-business-video-guide-2025', 'masterclass'] },
      { id: 'support', name: 'Weekly Support Package', requiredEntitlements: ['support', '5', 'weekly-support-contract-2025'] }
    ];

    const accessResults = productTests.map(product => {
      const hasAccess = product.requiredEntitlements.some(entitlement => 
        sessionEntitlements.includes(entitlement)
      );
      
      return {
        productId: product.id,
        productName: product.name,
        hasAccess,
        requiredEntitlements: product.requiredEntitlements,
        matchingEntitlements: product.requiredEntitlements.filter(e => sessionEntitlements.includes(e))
      };
    });

    const debugInfo = {
      user: {
        id: userId,
        email: userEmail,
        roles: session.user.roles
      },
      entitlements: {
        current: sessionEntitlements,
        count: sessionEntitlements.length
      },
      purchases: {
        byUserId: purchases.map(p => ({ 
          id: p.id, 
          product_id: p.product_id, 
          status: p.status, 
          created_at: p.created_at 
        })),
        byEmail: purchasesByEmail.map(p => ({ 
          id: p.id, 
          product_id: p.product_id, 
          status: p.status, 
          created_at: p.created_at 
        }))
      },
      access: accessResults,
      timestamp: new Date().toISOString()
    };

    const hasAnyAccess = accessResults.some(r => r.hasAccess);
    const totalPurchases = purchases.length + purchasesByEmail.length;

    return NextResponse.json({
      success: true,
      authenticated: true,
      hasAnyAccess,
      totalPurchases,
      message: hasAnyAccess 
        ? `Access granted! User has ${sessionEntitlements.length} entitlements and ${totalPurchases} purchases.`
        : `No access found. User has ${sessionEntitlements.length} entitlements and ${totalPurchases} purchases.`,
      debug: debugInfo
    });

  } catch (error: any) {
    console.error('❌ TEST ACCESS: Error testing access:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test access',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Same as GET for convenience
  return GET(request);
} 