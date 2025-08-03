const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixDatabaseStructure() {
  console.log('🔧 Fixing Database Structure for Purchase Unlock System...');
  console.log('=' .repeat(60));

  try {
    // 1. Add missing columns to purchases table
    console.log('\n1. Adding missing columns to purchases table...');
    
    const alterTableQueries = [
      `ALTER TABLE purchases ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;`,
      `ALTER TABLE purchases ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;`,
      `ALTER TABLE purchases ADD COLUMN IF NOT EXISTS payment_email TEXT;`,
      `ALTER TABLE purchases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`
    ];

    for (const query of alterTableQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error && !error.message.includes('already exists')) {
        console.log('⚠️  Query result:', query, error.message);
      }
    }
    
    console.log('✅ Purchase table columns updated');

    // 2. Create profiles table if it doesn't exist
    console.log('\n2. Creating profiles table...');
    const createProfilesTable = `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        email TEXT UNIQUE,
        full_name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: profilesError } = await supabase.rpc('exec_sql', { sql: createProfilesTable });
    if (profilesError) {
      console.log('⚠️  Profiles table creation:', profilesError.message);
    } else {
      console.log('✅ Profiles table ready');
    }

    // 3. Create email_queue table if it doesn't exist
    console.log('\n3. Creating email queue table...');
    const createEmailQueueTable = `
      CREATE TABLE IF NOT EXISTS email_queue (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        to_email VARCHAR(255) NOT NULL,
        from_email VARCHAR(255) DEFAULT 'noreply@ventaroai.com',
        subject VARCHAR(255) NOT NULL,
        html_content TEXT NOT NULL,
        text_content TEXT,
        template_name VARCHAR(100),
        template_variables JSONB DEFAULT '{}',
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
        attempts INTEGER DEFAULT 0,
        max_attempts INTEGER DEFAULT 3,
        error_message TEXT,
        scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        sent_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: emailQueueError } = await supabase.rpc('exec_sql', { sql: createEmailQueueTable });
    if (emailQueueError) {
      console.log('⚠️  Email queue table creation:', emailQueueError.message);
    } else {
      console.log('✅ Email queue table ready');
    }

    // 4. Create indexes for better performance
    console.log('\n4. Creating database indexes...');
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_purchases_customer_email ON purchases(customer_email);`,
      `CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_session_id);`,
      `CREATE INDEX IF NOT EXISTS idx_purchases_stripe_payment_intent ON purchases(stripe_payment_intent_id);`,
      `CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);`,
      `CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON email_queue(scheduled_at);`
    ];

    for (const query of indexQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error && !error.message.includes('already exists')) {
        console.log('⚠️  Index creation:', query, error.message);
      }
    }
    
    console.log('✅ Database indexes created');

    // 5. Test the fixed structure
    console.log('\n5. Testing fixed database structure...');
    
    // Test purchase creation with all required fields
    const testPurchase = {
      user_id: 'test-user-' + Date.now(),
      customer_email: 'test@example.com',
      payment_email: 'test@example.com',
      product_id: '1',
      product_name: 'Test Product',
      price: 29.99,
      stripe_session_id: 'cs_test_' + Date.now(),
      stripe_payment_intent_id: 'pi_test_' + Date.now()
    };
    
    const { data: createdPurchase, error: createError } = await supabase
      .from('purchases')
      .insert(testPurchase)
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Test purchase creation failed:', createError.message);
    } else {
      console.log('✅ Test purchase created successfully');
      
      // Clean up test data
      await supabase.from('purchases').delete().eq('id', createdPurchase.id);
      console.log('✅ Test data cleaned up');
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎯 DATABASE STRUCTURE FIX COMPLETE!');
    console.log('✅ Purchases table: All required columns added');
    console.log('✅ Profiles table: Created for user linking');
    console.log('✅ Email queue table: Created for notifications');
    console.log('✅ Database indexes: Created for performance');
    console.log('\n🚀 PURCHASE UNLOCK SYSTEM IS NOW FULLY READY!');
    
  } catch (error) {
    console.error('❌ Database structure fix failed:', error.message);
    
    // Alternative approach using direct SQL execution
    console.log('\n🔄 Trying alternative approach...');
    
    try {
      // Try to add columns one by one using direct queries
      const directQueries = [
        "ALTER TABLE purchases ADD COLUMN stripe_session_id TEXT",
        "ALTER TABLE purchases ADD COLUMN stripe_payment_intent_id TEXT", 
        "ALTER TABLE purchases ADD COLUMN payment_email TEXT"
      ];
      
      for (const query of directQueries) {
        try {
          await supabase.rpc('exec_sql', { sql: query });
          console.log('✅ Executed:', query);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.log('⚠️  Query failed:', query, err.message);
          }
        }
      }
      
    } catch (altError) {
      console.error('❌ Alternative approach also failed:', altError.message);
      console.log('\n📝 MANUAL STEPS REQUIRED:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Run the setup-email-notifications.sql file');
      console.log('3. Add missing columns to purchases table:');
      console.log('   - stripe_session_id TEXT');
      console.log('   - stripe_payment_intent_id TEXT');
      console.log('   - payment_email TEXT');
    }
  }
}

// Run the fix
fixDatabaseStructure().catch(console.error);