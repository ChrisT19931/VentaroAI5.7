import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/database';
import { PRODUCT_MAPPINGS, LEGACY_PRODUCT_MAPPINGS } from '@/config/products';

// Map numeric/short codes to front-end product IDs used in My Account
const FRONT_IDS_BY_CODE: Record<string, string> = {
  '1': 'ai-tools-mastery-guide-2025',
  '2': 'ai-prompts-arsenal-2025',
  '4': 'ai-business-video-guide-2025',
  '5': 'weekly-support-contract-2025',
};

// Map friendly keys to codes first, then to front-end IDs
const FRIENDLY_TO_CODE: Record<string, string> = {
  ebook: PRODUCT_MAPPINGS.ebook,
  prompts: PRODUCT_MAPPINGS.prompts,
  video: PRODUCT_MAPPINGS.video,
  support: PRODUCT_MAPPINGS.support,
};

export async function GET(request: NextRequest) {
  console.log('🔍 Fetching user products...');
  
  try {
    // Get user from NextAuth JWT token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      console.error('❌ Authentication required - no valid token');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    console.log('✅ User authenticated:', token.email);

    // Get user purchases from database
    const purchases = await db.getUserPurchases(token.id as string);
    console.log('✅ Found purchases:', purchases.length);

    const ownedFrontIds = new Set<string>();

    // Process each purchase to determine owned products
    for (const purchase of purchases) {
      const productId = purchase.product_id;
      console.log('Processing product ID:', productId);
      
      // Add the raw product ID
      ownedFrontIds.add(productId);
      
      // Case 1: already a front-end ID (check against known IDs)
      if (Object.values(FRONT_IDS_BY_CODE).includes(productId)) {
        ownedFrontIds.add(productId);
        continue;
      }

      // Case 2: numeric/short code like '1','2','4','5'
      if (FRONT_IDS_BY_CODE[productId]) {
        ownedFrontIds.add(FRONT_IDS_BY_CODE[productId]);
        continue;
      }

      // Case 3: friendly key like 'ebook'|'prompts'|'video'|'support'
      if (FRIENDLY_TO_CODE[productId]) {
        const code = FRIENDLY_TO_CODE[productId];
        if (FRONT_IDS_BY_CODE[code]) {
          ownedFrontIds.add(FRONT_IDS_BY_CODE[code]);
        }
        continue;
      }

      // Case 4: legacy product name (e.g., 'ai-prompts-arsenal-2025')
      const legacyCode = LEGACY_PRODUCT_MAPPINGS[productId as keyof typeof LEGACY_PRODUCT_MAPPINGS];
      if (legacyCode && FRONT_IDS_BY_CODE[legacyCode]) {
        ownedFrontIds.add(FRONT_IDS_BY_CODE[legacyCode]);
        continue;
      }
    }

    const ownedProducts = Array.from(ownedFrontIds);
    console.log('✅ Final owned products:', ownedProducts);

    return NextResponse.json({ 
      success: true, 
      products: ownedProducts,
      debug: {
        userId: token.id,
        purchaseCount: purchases.length,
        rawPurchases: purchases.map(p => ({ id: p.id, product_id: p.product_id, status: p.status }))
      }
    });

  } catch (error: any) {
    console.error('❌ User products API error:', error);
    return NextResponse.json({ 
      error: 'Failed to resolve user products',
      details: error.message 
    }, { status: 500 });
  }
} 