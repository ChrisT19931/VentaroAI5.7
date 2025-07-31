require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCoachingTable() {
  console.log('🔍 Checking coaching_bookings table...');
  
  try {
    // Try to fetch from the table to see if it exists
    const { data, error } = await supabase
      .from('coaching_bookings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Table error:', error.message);
      console.log('   Code:', error.code);
      console.log('   Details:', error.details);
      
      if (error.code === '42P01') {
        console.log('\n📝 The coaching_bookings table does not exist.');
        console.log('   Creating the table...');
        
        // Create the table
        const { error: createError } = await supabase.rpc('create_coaching_bookings_table');
        
        if (createError) {
          console.log('❌ Could not create table via RPC. Trying direct SQL...');
          
          // Try creating table with direct SQL (this might not work with service role)
          const createTableSQL = `
            CREATE TABLE IF NOT EXISTS coaching_bookings (
              id SERIAL PRIMARY KEY,
              user_id TEXT NOT NULL,
              user_email TEXT NOT NULL,
              user_name TEXT NOT NULL,
              scheduled_date DATE NOT NULL,
              scheduled_time TEXT NOT NULL,
              timezone TEXT NOT NULL,
              session_type TEXT DEFAULT 'AI Business Strategy Session',
              notes TEXT,
              status TEXT DEFAULT 'pending',
              meeting_link TEXT,
              admin_notes TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;
          
          console.log('\n🔧 Table creation SQL:');
          console.log(createTableSQL);
          console.log('\n⚠️  Please run this SQL in your Supabase dashboard to create the table.');
        }
      }
    } else {
      console.log('✅ Table exists!');
      console.log('   Current records:', data.length);
      if (data.length > 0) {
        console.log('   Sample record structure:', Object.keys(data[0]));
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkCoachingTable();