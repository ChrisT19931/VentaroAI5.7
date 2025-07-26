const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupEmailStorage() {
  console.log('🚀 Setting up email storage buckets...');
  
  try {
    // Create emails bucket
    console.log('📧 Creating emails bucket...');
    const { data: emailsBucket, error: emailsBucketError } = await supabase.storage
      .createBucket('emails', {
        public: false,
        allowedMimeTypes: ['application/json'],
        fileSizeLimit: 5242880 // 5MB
      });
    
    if (emailsBucketError && !emailsBucketError.message.includes('already exists')) {
      console.error('❌ Error creating emails bucket:', emailsBucketError.message);
    } else {
      console.log('✅ Emails bucket created/verified');
    }
    
    // Create email-attachments bucket
    console.log('📎 Creating email-attachments bucket...');
    const { data: attachmentsBucket, error: attachmentsBucketError } = await supabase.storage
      .createBucket('email-attachments', {
        public: false,
        allowedMimeTypes: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'image/gif',
          'text/plain',
          'application/zip'
        ],
        fileSizeLimit: 10485760 // 10MB
      });
    
    if (attachmentsBucketError && !attachmentsBucketError.message.includes('already exists')) {
      console.error('❌ Error creating email-attachments bucket:', attachmentsBucketError.message);
    } else {
      console.log('✅ Email-attachments bucket created/verified');
    }
    
    console.log('\n🔐 Setting up storage policies...');
    
    // Set up policies for emails bucket
    const emailsPolicies = [
      {
        name: 'Users can upload their own emails',
        definition: `
          CREATE POLICY "Users can upload their own emails" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'emails' AND
            auth.uid() IS NOT NULL
          );
        `
      },
      {
        name: 'Users can view their own emails',
        definition: `
          CREATE POLICY "Users can view their own emails" ON storage.objects
          FOR SELECT USING (
            bucket_id = 'emails' AND
            auth.uid() IS NOT NULL
          );
        `
      },
      {
        name: 'Users can delete their own emails',
        definition: `
          CREATE POLICY "Users can delete their own emails" ON storage.objects
          FOR DELETE USING (
            bucket_id = 'emails' AND
            auth.uid() IS NOT NULL
          );
        `
      }
    ];
    
    // Set up policies for email-attachments bucket
    const attachmentsPolicies = [
      {
        name: 'Users can upload to their own folder',
        definition: `
          CREATE POLICY "Users can upload to their own folder" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'email-attachments' AND
            auth.uid() IS NOT NULL AND
            (storage.foldername(name))[1] = auth.uid()::text
          );
        `
      },
      {
        name: 'Users can view their own attachments',
        definition: `
          CREATE POLICY "Users can view their own attachments" ON storage.objects
          FOR SELECT USING (
            bucket_id = 'email-attachments' AND
            auth.uid() IS NOT NULL AND
            (storage.foldername(name))[1] = auth.uid()::text
          );
        `
      },
      {
        name: 'Users can delete their own attachments',
        definition: `
          CREATE POLICY "Users can delete their own attachments" ON storage.objects
          FOR DELETE USING (
            bucket_id = 'email-attachments' AND
            auth.uid() IS NOT NULL AND
            (storage.foldername(name))[1] = auth.uid()::text
          );
        `
      }
    ];
    
    // Apply policies
    const allPolicies = [...emailsPolicies, ...attachmentsPolicies];
    
    for (const policy of allPolicies) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: policy.definition
        });
        
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️  Policy "${policy.name}" may already exist or failed:`, error.message);
        } else {
          console.log(`✅ Policy "${policy.name}" applied`);
        }
      } catch (err) {
        console.warn(`⚠️  Could not apply policy "${policy.name}":`, err.message);
      }
    }
    
    console.log('\n🎉 Email storage setup completed!');
    console.log('\n📋 Summary:');
    console.log('   • emails bucket: For storing JSON email logs');
    console.log('   • email-attachments bucket: For storing user attachments');
    console.log('   • Row Level Security policies applied');
    console.log('   • File size limits: 5MB for emails, 10MB for attachments');
    
    console.log('\n🔗 Next steps:');
    console.log('   1. Visit /email-manager to test the functionality');
    console.log('   2. Upload sample email logs');
    console.log('   3. Test attachment uploads');
    console.log('   4. Try the search functionality');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Alternative SQL setup for manual execution
function printManualSetupSQL() {
  console.log('\n📝 Manual SQL Setup (if automated setup fails):');
  console.log('\nRun these commands in your Supabase SQL Editor:');
  console.log('\n-- Create storage buckets');
  console.log(`
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('emails', 'emails', false, 5242880, ARRAY['application/json']),
  ('email-attachments', 'email-attachments', false, 10485760, ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/zip'
  ])
ON CONFLICT (id) DO NOTHING;`);
  
  console.log('\n-- Create storage policies');
  console.log(`
-- Emails bucket policies
CREATE POLICY "Users can manage emails" ON storage.objects
FOR ALL USING (
  bucket_id = 'emails' AND
  auth.uid() IS NOT NULL
);

-- Email attachments bucket policies  
CREATE POLICY "Users can manage their attachments" ON storage.objects
FOR ALL USING (
  bucket_id = 'email-attachments' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text
);`);
}

if (require.main === module) {
  setupEmailStorage().catch(error => {
    console.error('Setup failed:', error);
    printManualSetupSQL();
    process.exit(1);
  });
}

module.exports = { setupEmailStorage, printManualSetupSQL };