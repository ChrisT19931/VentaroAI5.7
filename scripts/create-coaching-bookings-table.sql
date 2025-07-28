-- Create coaching_bookings table for the calendar booking system
CREATE TABLE IF NOT EXISTS coaching_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  timezone TEXT NOT NULL,
  session_type TEXT DEFAULT 'AI Business Strategy Session',
  notes TEXT,
  status TEXT DEFAULT 'pending_confirmation' CHECK (status IN ('pending_confirmation', 'confirmed', 'cancelled', 'completed')),
  meeting_link TEXT,
  admin_notes TEXT,
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coaching_bookings_date_time ON coaching_bookings(scheduled_date, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_coaching_bookings_user_id ON coaching_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_bookings_status ON coaching_bookings(status);
CREATE INDEX IF NOT EXISTS idx_coaching_bookings_email ON coaching_bookings(user_email);

-- Enable Row Level Security
ALTER TABLE coaching_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for coaching_bookings
CREATE POLICY "Users can view own bookings" ON coaching_bookings
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create own bookings" ON coaching_bookings
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own bookings" ON coaching_bookings
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Admins can manage all bookings" ON coaching_bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_coaching_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_coaching_bookings_updated_at_trigger ON coaching_bookings;
CREATE TRIGGER update_coaching_bookings_updated_at_trigger
  BEFORE UPDATE ON coaching_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_coaching_bookings_updated_at();

-- Verify the table was created
SELECT 'coaching_bookings table created successfully!' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'coaching_bookings' 
ORDER BY ordinal_position;