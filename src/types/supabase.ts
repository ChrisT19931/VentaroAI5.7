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
      coaching_intakes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          user_email: string
          project_type: string
          current_hosting: string | null
          tech_stack: string | null
          timeline: string
          specific_challenges: string
          preferred_times: string
          timezone: string
          additional_info: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          user_email: string
          project_type: string
          current_hosting?: string | null
          tech_stack?: string | null
          timeline: string
          specific_challenges: string
          preferred_times: string
          timezone: string
          additional_info?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          user_email?: string
          project_type?: string
          current_hosting?: string | null
          tech_stack?: string | null
          timeline?: string
          specific_challenges?: string
          preferred_times?: string
          timezone?: string
          additional_info?: string | null
          status?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          subject: string
          product: string | null
          message: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          subject: string
          product?: string | null
          message: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          subject?: string
          product?: string | null
          message?: string
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