export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          price: number
          image_url: string | null
          file_url: string | null
          category: string | null
          featured: boolean
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          price: number
          image_url?: string | null
          file_url?: string | null
          category?: string | null
          featured?: boolean
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          price?: number
          image_url?: string | null
          file_url?: string | null
          category?: string | null
          featured?: boolean
          is_active?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          user_id: string
          status: string
          total: number
          payment_intent_id: string | null
          payment_status: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          status: string
          total: number
          payment_intent_id?: string | null
          payment_status?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          status?: string
          total?: number
          payment_intent_id?: string | null
          payment_status?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          download_url: string | null
          download_count: number
          download_expiry: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          download_url?: string | null
          download_count?: number
          download_expiry?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          download_url?: string | null
          download_count?: number
          download_expiry?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          first_name: string | null
          last_name: string | null
          email: string
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string | null
          first_name?: string | null
          last_name?: string | null
          email: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string
          is_admin?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}