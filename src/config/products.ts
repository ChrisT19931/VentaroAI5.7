// Product configuration for centralized mapping management

export const PRODUCTS = {
  video: 'ai-business-video-guide-2025',
  support: 'weekly-support-contract',
  prompts: 'ai-prompts-arsenal-2025',
  ebook: 'ai-tools-mastery-guide-2025',
  custom: 'webgen'
};

// Legacy product mappings for backward compatibility
export const LEGACY_PRODUCTS = {
  'ai-prompts-arsenal-2025': 'prompts',
  'ai-tools-mastery-guide-2025': 'ebook',
  'ai-business-strategy-session-2025': 'video', // Redirect old coaching to new video offer
  'weekly-support-contract-2025': 'support',
  'custom-website-creation-2025': 'custom'
};

// Maps database product_id values to frontend product IDs
export const PRODUCT_MAPPINGS = {
  'ebook': '1',
  'prompts': '2', 
  'coaching': '3',
  'video': 'ai-business-video-guide-2025',
  'support': 'weekly-support-contract',
  'custom': 'webgen'
} as const;

// Maps legacy product names to frontend product IDs
export const LEGACY_PRODUCT_MAPPINGS = {
  'ai-prompts-arsenal-2025': '2',
  'ai-tools-mastery-guide-2025': '1',
  'ai-business-strategy-session-2025': 'ai-business-video-guide-2025',
  'ai-business-video-guide-2025': 'ai-business-video-guide-2025',
  'weekly-support-contract-2025': 'weekly-support-contract',
  'weekly-support-contract': 'weekly-support-contract',
  'custom-website-creation-2025': 'webgen',
  'webgen': 'webgen'
} as const;

// Type definitions for the mappings
export type ProductIdMapping = typeof PRODUCT_MAPPINGS;
export type LegacyProductMapping = typeof LEGACY_PRODUCT_MAPPINGS;