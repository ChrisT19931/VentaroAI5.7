import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/database';
import { PRODUCT_MAPPINGS, LEGACY_PRODUCT_MAPPINGS } from '@/config/products';

// Maps database product_id values to frontend product IDs
const FRONT_IDS_BY_CODE: Record<string, string> = {
  '1': 'ai-tools-mastery-guide-2025',
  '2': 'ai-prompts-arsenal-2025',
  '4': 'ai-business-video-guide-2025',
  '5': 'weekly-support-contract-2025',
};

// Maps friendly keys to database codes
const FRIENDLY_TO_CODE: Record<string, string> = {
  ebook: PRODUCT_MAPPINGS.ebook,
  prompts: PRODUCT_MAPPINGS.prompts,
  video: PRODUCT_MAPPINGS.video,
  support: PRODUCT_MAPPINGS.support,
};

// Additional mapping for any product IDs that might come in different formats
const ADDITIONAL_MAPPINGS: Record<string, string> = {
  'ai-web-creation-masterclass': 'ai-business-video-guide-2025',
  'support-package': 'weekly-support-contract-2025',
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
      
      let mappedProductId = productId;
      
      // Case 1: Direct numeric/short code mapping (e.g., '1' -> 'ai-tools-mastery-guide-2025')
      if (FRONT_IDS_BY_CODE[productId]) {
        mappedProductId = FRONT_IDS_BY_CODE[productId];
        ownedFrontIds.add(mappedProductId);
        console.log(`✅ Mapped code '${productId}' to '${mappedProductId}'`);
        continue;
      }

      // Case 2: Additional mappings (e.g., 'ai-web-creation-masterclass' -> 'ai-business-video-guide-2025')
      if (ADDITIONAL_MAPPINGS[productId]) {
        mappedProductId = ADDITIONAL_MAPPINGS[productId];
        ownedFrontIds.add(mappedProductId);
        console.log(`✅ Mapped additional '${productId}' to '${mappedProductId}'`);
        continue;
      }

      // Case 3: Already a frontend ID (check against known frontend IDs)
      const frontendIds = Object.values(FRONT_IDS_BY_CODE);
      if (frontendIds.includes(productId)) {
        ownedFrontIds.add(productId);
        console.log(`✅ Direct frontend ID: '${productId}'`);
        continue;
      }

      // Case 4: Friendly key mapping (e.g., 'ebook' -> '1' -> 'ai-tools-mastery-guide-2025')
      if (FRIENDLY_TO_CODE[productId]) {
        const code = FRIENDLY_TO_CODE[productId];
        if (FRONT_IDS_BY_CODE[code]) {
          mappedProductId = FRONT_IDS_BY_CODE[code];
          ownedFrontIds.add(mappedProductId);
          console.log(`✅ Mapped friendly key '${productId}' -> '${code}' -> '${mappedProductId}'`);
        }
        continue;
      }

      // Case 5: Legacy product name mapping
      const legacyCode = LEGACY_PRODUCT_MAPPINGS[productId as keyof typeof LEGACY_PRODUCT_MAPPINGS];
      if (legacyCode && FRONT_IDS_BY_CODE[legacyCode]) {
        mappedProductId = FRONT_IDS_BY_CODE[legacyCode];
        ownedFrontIds.add(mappedProductId);
        console.log(`✅ Mapped legacy '${productId}' -> '${legacyCode}' -> '${mappedProductId}'`);
        continue;
      }

      // Case 6: Fallback - add the raw product ID in case it's already correct
      ownedFrontIds.add(productId);
      console.log(`⚠️ No mapping found for '${productId}', using as-is`);
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