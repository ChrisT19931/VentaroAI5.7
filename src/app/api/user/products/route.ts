import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { PRODUCT_MAPPINGS, LEGACY_PRODUCT_MAPPINGS } from '@/config/products';

// Map numeric/short codes to front-end product IDs used in My Account
const FRONT_IDS_BY_CODE: Record<string, string> = {
  '1': 'ai-tools-mastery-guide-2025',
  '2': 'ai-prompts-arsenal-2025',
  '3': 'ai-business-video-guide-2025',
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
  try {
    // Get session token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Pull entitlements directly from token (set during NextAuth authorize)
    const entitlements = (token.entitlements as string[]) || [];

    const ownedFrontIds = new Set<string>();

    for (const raw of entitlements) {
      const value = String(raw).trim();

      // Case 1: already a front-end ID
      if (FRONT_IDS_BY_CODE['1'] === value || FRONT_IDS_BY_CODE['2'] === value || FRONT_IDS_BY_CODE['3'] === value || FRONT_IDS_BY_CODE['5'] === value) {
        ownedFrontIds.add(value);
        continue;
      }

      // Case 2: numeric/short code like '1','2','3','5'
      if (FRONT_IDS_BY_CODE[value]) {
        ownedFrontIds.add(FRONT_IDS_BY_CODE[value]);
        continue;
      }

      // Case 3: friendly key like 'ebook'|'prompts'|'video'|'support'
      if (FRIENDLY_TO_CODE[value]) {
        const code = FRIENDLY_TO_CODE[value];
        if (FRONT_IDS_BY_CODE[code]) ownedFrontIds.add(FRONT_IDS_BY_CODE[code]);
        continue;
      }

      // Case 4: legacy front name → map via LEGACY_PRODUCT_MAPPINGS inverse
      // Build inverse once
      const inverseLegacy: Record<string, string> = Object.entries(LEGACY_PRODUCT_MAPPINGS)
        .reduce((acc, [legacyName, code]) => {
          acc[code] = legacyName; // not used directly
          return acc;
        }, {} as Record<string, string>);

      // If raw is a legacy product name, accept it as a valid front ID
      if (LEGACY_PRODUCT_MAPPINGS[value as keyof typeof LEGACY_PRODUCT_MAPPINGS]) {
        ownedFrontIds.add(value);
        continue;
      }
    }

    return NextResponse.json({ success: true, products: Array.from(ownedFrontIds) });
  } catch (error: any) {
    console.error('User products API error:', error);
    return NextResponse.json({ error: 'Failed to resolve user products' }, { status: 500 });
  }
} 