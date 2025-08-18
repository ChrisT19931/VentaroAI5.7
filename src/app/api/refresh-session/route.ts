import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { bulletproofAuth } from '@/lib/auth-bulletproof';

// Product ID mapping for entitlements (same as in auth.ts)
const PRODUCT_ENTITLEMENT_MAP: Record<string, string[]> = {
  '1': ['ai-tools-mastery-guide-2025', 'ebook'],
  '2': ['ai-prompts-arsenal-2025', 'prompts'], 
  '4': ['ai-business-video-guide-2025', 'video', 'masterclass'],
  '5': ['weekly-support-contract-2025', 'support'],
  'ebook': ['ai-tools-mastery-guide-2025', 'ebook', '1'],
  'prompts': ['ai-prompts-arsenal-2025', 'prompts', '2'],
  'video': ['ai-business-video-guide-2025', 'video', 'masterclass', '4'],
  'support': ['weekly-support-contract-2025', 'support', '5'],
  'coaching': ['coaching', 'session']
};

function mapPurchasesToEntitlements(purchases: any[]): string[] {
  const entitlements = new Set<string>();
  
  for (const purchase of purchases) {
    const productId = purchase.product_id;
    
    // Add the raw product ID
    entitlements.add(productId);
    
    // Add mapped entitlements
    if (PRODUCT_ENTITLEMENT_MAP[productId]) {
      PRODUCT_ENTITLEMENT_MAP[productId].forEach(entitlement => {
        entitlements.add(entitlement);
      });
    }
  }
  
  return Array.from(entitlements);
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 REFRESH SESSION: Starting session refresh...');
    
    // Get current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error('❌ REFRESH SESSION: No valid session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    
    console.log(`🔄 REFRESH SESSION: Refreshing for user ${userId} (${userEmail})`);

    // Get fresh purchases from database
    let purchases = [];
    try {
      purchases = await bulletproofAuth.getUserPurchases(userId);
      console.log(`✅ REFRESH SESSION: Found ${purchases.length} purchases for user`);
    } catch (error) {
      console.error('❌ REFRESH SESSION: Error fetching purchases:', error);
      // Try to get purchases by email as fallback
      try {
        const purchasesByEmail = await bulletproofAuth.getUserPurchasesByEmail(userEmail);
        if (purchasesByEmail.length > 0) {
          purchases = purchasesByEmail;
          console.log(`✅ REFRESH SESSION: Found ${purchases.length} purchases by email fallback`);
        }
      } catch (emailError) {
        console.error('❌ REFRESH SESSION: Email fallback also failed:', emailError);
      }
    }

    // Map purchases to entitlements
    const newEntitlements = mapPurchasesToEntitlements(purchases);
    console.log('🎯 REFRESH SESSION: New entitlements:', newEntitlements);
    
    // Return the updated entitlements
    // Note: NextAuth will pick up these changes on the next session() call
    return NextResponse.json({
      success: true,
      entitlements: newEntitlements,
      purchaseCount: purchases.length,
      message: 'Session entitlements refreshed successfully'
    });

  } catch (error: any) {
    console.error('❌ REFRESH SESSION: Error refreshing session:', error);
    return NextResponse.json({
      error: 'Failed to refresh session',
      message: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Allow GET requests for debugging
  return POST(request);
} 