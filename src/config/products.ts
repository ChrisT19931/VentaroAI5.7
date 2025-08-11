// Product configuration for centralized mapping management

export const PRODUCTS = {
  video: 'ai-web-creation-masterclass',
  support: 'support-package',
  prompts: 'ai-prompts-arsenal-2025',
  ebook: 'ai-tools-mastery-guide-2025'
};

// Legacy product mappings for backward compatibility
export const LEGACY_PRODUCTS = {
  'ai-prompts-arsenal-2025': 'prompts',
  'ai-tools-mastery-guide-2025': 'ebook',
  'ai-business-strategy-session-2025': 'video', // Redirect old coaching to new video offer
  'ai-business-video-guide-2025': 'video', // Redirect old video to new masterclass
  'weekly-support-contract-2025': 'support',
  'weekly-support-contract': 'support',
  'support-package': 'support',

};

// Maps database product_id values to frontend product IDs
export const PRODUCT_MAPPINGS = {
  'ebook': '1',
  'prompts': '2', 
  'video': '3',
  'support': '5'
} as const;

// Maps legacy product names to frontend product IDs
export const LEGACY_PRODUCT_MAPPINGS = {
  'ai-prompts-arsenal-2025': '2',
  'ai-tools-mastery-guide-2025': '1',
  'ai-business-strategy-session-2025': '3',
  'ai-business-video-guide-2025': '3',
  'ai-web-creation-masterclass': '3',
  'weekly-support-contract-2025': '5',
  'weekly-support-contract': '5',
  'support-package': '5',

} as const;

// Type definitions for the mappings
export type ProductIdMapping = typeof PRODUCT_MAPPINGS;
export type LegacyProductMapping = typeof LEGACY_PRODUCT_MAPPINGS;