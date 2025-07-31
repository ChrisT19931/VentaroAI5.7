const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkContactTable() {
  console.log('🔍 Checking contact_submissions table...');
  console.log('=' .repeat(50));

  try {
    // Try to query the table to see if it exists
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ Table "contact_submissions" does not exist');
        console.log('');
        console.log('📋 SQL to create the table manually in Supabase:');
        console.log('=' .repeat(50));
        console.log(`
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  product TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can view all contact submissions" ON public.contact_submissions
  FOR ALL USING (auth.jwt() ->> 'email' = 'chris.t@ventarosales.com');

-- Create indexes for better performance
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX idx_contact_submissions_subject ON public.contact_submissions(subject);
`);
        console.log('=' .repeat(50));
        console.log('');
        console.log('📝 Instructions:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the SQL above');
        console.log('4. Run the query to create the table');
        
        // Try to create the table programmatically
        console.log('');
        console.log('🔧 Attempting to create table programmatically...');
        
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS public.contact_submissions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            product TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableQuery });
        
        if (createError) {
          console.log('❌ Could not create table programmatically');
          console.log('Please create the table manually using the SQL above');
        } else {
          console.log('✅ Table created successfully!');
        }
      } else {
        console.error('❌ Error querying table:', error.message);
      }
    } else {
      console.log('✅ Table "contact_submissions" exists');
      console.log(`📊 Found ${data.length} existing records`);
      
      // Show table structure
      console.log('');
      console.log('📋 Testing table structure...');
      
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        product: 'Test Product',
        message: 'This is a test message to verify table structure.'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('contact_submissions')
        .insert([testData])
        .select();
      
      if (insertError) {
        console.log('❌ Error inserting test data:', insertError.message);
      } else {
        console.log('✅ Test data inserted successfully');
        console.log('📄 Inserted record:', insertData[0]);
        
        // Clean up test data
        await supabase
          .from('contact_submissions')
          .delete()
          .eq('id', insertData[0].id);
        
        console.log('🧹 Test data cleaned up');
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the check
checkContactTable();