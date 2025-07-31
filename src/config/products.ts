// Product configuration for centralized mapping management

// Maps database product_id values to frontend product IDs
export const PRODUCT_MAPPINGS = {
  'ebook': '1',
  'prompts': '2', 
  'coaching': '3'
} as const;

// Maps legacy product names to frontend product IDs
export const LEGACY_PRODUCT_MAPPINGS = {
  'ai-prompts-arsenal-2025': '2',
  'ai-tools-mastery-guide-2025': '1'
} as const;

// Type definitions for the mappings
export type ProductIdMapping = typeof PRODUCT_MAPPINGS;
export type LegacyProductMapping = typeof LEGACY_PRODUCT_MAPPINGS;