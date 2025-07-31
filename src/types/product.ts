// TypeScript interfaces for product-related data structures

export interface Purchase {
  id: string;
  product_id: string;
  customer_email: string;
  created_at: string;
  user_id?: string;
  stripe_session_id?: string;
  price?: number; // Changed from 'amount' to match database schema
}

export interface Product {
  id: string;
  name: string;
  price?: number;
  owned?: boolean;
  description?: string;
  image_url?: string;
  viewUrl?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  is_admin?: boolean;
}

// Utility types for product ownership
export type ProductOwnershipCheck = (purchase: Purchase, productId: string) => boolean;
export type ProductWithOwnership = Product & { owned: boolean };