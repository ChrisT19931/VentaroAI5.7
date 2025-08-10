// Product configuration for centralized mapping management

export const PRODUCTS = {
  video: 'ai-business-video-guide-2025',
  support: 'weekly-support-contract-2025',
  prompts: 'ai-prompts-arsenal-2025',
  ebook: 'ai-tools-mastery-guide-2025',
  custom: 'custom-website-creation-2025'
};

// Legacy product mappings for backward compatibility
export const LEGACY_PRODUCTS = {
  'ai-prompts-arsenal-2025': 'prompts',
  'ai-tools-mastery-guide-2025': 'ebook',
  'ai-business-strategy-session-2025': 'video' // Redirect old coaching to new video offer
};

// Maps database product_id values to frontend product IDs
export const PRODUCT_MAPPINGS = {
  'ebook': '1',
  'prompts': '2', 
  'coaching': '3',
  'video': '4',
  'support': '5',
  'custom': '6'
} as const;

// Maps legacy product names to frontend product IDs
export const LEGACY_PRODUCT_MAPPINGS = {
  'ai-prompts-arsenal-2025': '2',
  'ai-tools-mastery-guide-2025': '1',
  'ai-business-strategy-session-2025': '4'
} as const;

// Type definitions for the mappings
export type ProductIdMapping = typeof PRODUCT_MAPPINGS;
export type LegacyProductMapping = typeof LEGACY_PRODUCT_MAPPINGS;