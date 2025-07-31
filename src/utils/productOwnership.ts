// Utility functions for product ownership logic

import { PRODUCT_MAPPINGS, LEGACY_PRODUCT_MAPPINGS } from '@/config/products';
import { Purchase } from '@/types/product';

/**
 * Checks if a user owns a specific product based on their purchase data
 * @param purchase - The purchase record from the database
 * @param productId - The frontend product ID to check against
 * @returns boolean indicating ownership
 */
export function checkProductOwnership(purchase: Purchase, productId: string): boolean {
  // Direct product_id match
  if (purchase.product_id === productId) {
    return true;
  }
  
  // Check mapped product_ids (database values to frontend IDs)
  if (PRODUCT_MAPPINGS[purchase.product_id as keyof typeof PRODUCT_MAPPINGS] === productId) {
    return true;
  }
  
  // Check legacy product mappings
  if (LEGACY_PRODUCT_MAPPINGS[purchase.product_id as keyof typeof LEGACY_PRODUCT_MAPPINGS] === productId) {
    return true;
  }
  
  return false;
}

/**
 * Enhanced ownership check with logging for debugging
 * @param purchase - The purchase record from the database
 * @param productId - The frontend product ID to check against
 * @param enableLogging - Whether to log ownership matches
 * @returns boolean indicating ownership
 */
export function checkProductOwnershipWithLogging(
  purchase: Purchase, 
  productId: string, 
  enableLogging: boolean = false
): boolean {
  const owns = checkProductOwnership(purchase, productId);
  
  if (owns && enableLogging) {
    console.log(`User owns product ${productId} via purchase ${purchase.product_id}`);
  }
  
  return owns;
}

/**
 * Gets all product IDs that a user owns based on their purchases
 * @param purchases - Array of user's purchases
 * @param allProductIds - Array of all available product IDs
 * @returns Array of owned product IDs
 */
export function getOwnedProductIds(purchases: Purchase[], allProductIds: string[]): string[] {
  return allProductIds.filter(productId => 
    purchases.some(purchase => checkProductOwnership(purchase, productId))
  );
}