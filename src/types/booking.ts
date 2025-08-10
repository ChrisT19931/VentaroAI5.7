export interface Booking {
  id: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  user_email: string;
  user_name?: string;
  scheduled_date: string;
  scheduled_time: string;
  timezone: string;
  session_type: string;
  notes?: string;
  status: 'pending_confirmation' | 'confirmed' | 'cancelled' | 'completed';
  meeting_link?: string;
  admin_notes?: string;
  confirmation_sent_at?: string;
  reminder_sent_at?: string;
}