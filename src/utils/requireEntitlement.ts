import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PRODUCT_MAPPINGS, LEGACY_PRODUCT_MAPPINGS } from '@/config/products';

/**
 * Server-side function to require a specific product entitlement
 * Redirects to login or paywall if the user doesn't have the required entitlement
 * 
 * @param productSlug The product slug or price ID to check for entitlement
 * @param redirectTo Where to redirect if not authenticated (default: /login)
 * @param redirectToPaywall Where to redirect if authenticated but not entitled (default: /products)
 * @returns The user session if authenticated and entitled
 */
export async function requireEntitlement(
  productSlug: string,
  redirectTo: string = '/login',
  redirectToPaywall: string = '/products'
) {
  // Get the session
  const session = await getServerSession(authOptions);
  
  // If not authenticated, redirect to login
  if (!session) {
    redirect(redirectTo);
  }
  
  // Get the product ID from the slug or price ID
  let productId = productSlug;
  
  // Check if the slug is a mapped product
  if (PRODUCT_MAPPINGS[productSlug as keyof typeof PRODUCT_MAPPINGS]) {
    productId = PRODUCT_MAPPINGS[productSlug as keyof typeof PRODUCT_MAPPINGS];
  }
  
  // Check if the slug is a legacy product
  if (LEGACY_PRODUCT_MAPPINGS && LEGACY_PRODUCT_MAPPINGS[productSlug as keyof typeof LEGACY_PRODUCT_MAPPINGS]) {
    productId = LEGACY_PRODUCT_MAPPINGS[productSlug as keyof typeof LEGACY_PRODUCT_MAPPINGS];
  }
  
  // Check if the user has the required entitlement
  const hasEntitlement = session.user.entitlements.includes(productId);
  
  // If not entitled, redirect to paywall
  if (!hasEntitlement) {
    redirect(redirectToPaywall);
  }
  
  // Return the session for further use
  return session;
}

/**
 * Server-side function to check if a user has a specific product entitlement
 * without redirecting
 * 
 * @param userId The user ID to check
 * @param productSlug The product slug or price ID to check for entitlement
 * @returns Boolean indicating if the user has the entitlement
 */
export async function checkEntitlement(userId: string, productSlug: string): Promise<boolean> {
  try {
    // Import supabase here to avoid circular dependencies
    const { supabase } = await import('@/lib/supabase');
    
    // Get the product ID from the slug or price ID
    let productId = productSlug;
    
    // Check if the slug is a mapped product
    if (PRODUCT_MAPPINGS[productSlug as keyof typeof PRODUCT_MAPPINGS]) {
      productId = PRODUCT_MAPPINGS[productSlug as keyof typeof PRODUCT_MAPPINGS];
    }
    
    // Check if the slug is a legacy product
    if (LEGACY_PRODUCT_MAPPINGS && LEGACY_PRODUCT_MAPPINGS[productSlug as keyof typeof LEGACY_PRODUCT_MAPPINGS]) {
      productId = LEGACY_PRODUCT_MAPPINGS[productSlug as keyof typeof LEGACY_PRODUCT_MAPPINGS];
    }
    
    // Query the purchases table
    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    
    if (error) {
      console.error('Error checking entitlement:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return false;
  }
}