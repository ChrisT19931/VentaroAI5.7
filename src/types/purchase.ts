// Define the Purchase type based on the database schema
export interface Purchase {
  id: string;
  user_id?: string | null;
  customer_email: string;
  product_id: string;
  product_name: string;
  price: number;
  currency: string;
  payment_intent_id: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}