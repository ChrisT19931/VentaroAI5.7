/**
 * Setup script for all 11 Supabase storage buckets
 * Creates buckets with proper policies, file size limits, and MIME type restrictions
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Bucket configurations
const bucketConfigs = [
  {
    id: 'emails',
    name: 'emails',
    public: false,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['application/json'],
    description: 'JSON logs of sent/received emails'
  },
  {
    id: 'email-attachments',
    name: 'email-attachments',
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'application/zip'
    ],
    description: 'Email attachments organized by user ID'
  },
  {
    id: 'user-profiles',
    name: 'user-profiles',
    public: true, // Profile images can be public
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/json'
    ],
    description: 'User profile images and data'
  },
  {
    id: 'documents',
    name: 'documents',
    public: false,
    fileSizeLimit: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'application/rtf',
      'application/vnd.oasis.opendocument.text'
    ],
    description: 'User documents like resumes, proposals, IDs'
  },
  {
    id: 'logs',
    name: 'logs',
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['application/json', 'text/plain'],
    description: 'System event logs and form submissions'
  },
  {
    id: 'products',
    name: 'products',
    public: true, // Product assets can be public
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/zip',
      'video/mp4',
      'audio/mpeg'
    ],
    description: 'Product images, PDFs, and downloadable assets'
  },
  {
    id: 'chat-exports',
    name: 'chat-exports',
    public: false,
    fileSizeLimit: 25 * 1024 * 1024, // 25MB
    allowedMimeTypes: ['application/json', 'text/plain'],
    description: 'AI chat transcripts and support logs'
  },
  {
    id: 'drafts',
    name: 'drafts',
    public: false,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['application/json', 'text/plain'],
    description: 'User-saved drafts in text or JSON format'
  },
  {
    id: 'settings',
    name: 'settings',
    public: false,
    fileSizeLimit: 1 * 1024 * 1024, // 1MB
    allowedMimeTypes: ['application/json'],
    description: 'User and global settings files'
  },
  {
    id: 'backups',
    name: 'backups',
    public: false,
    fileSizeLimit: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: ['application/json', 'text/csv'],
    description: 'Admin-scheduled data exports and backups'
  },
  {
    id: 'terms-policies',
    name: 'terms-policies',
    public: true, // Legal documents should be publicly readable
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'text/html',
      'text/plain',
      'text/markdown'
    ],
    description: 'Legal documents like Terms & Conditions, Privacy Policy'
  }
];

// Storage policies for each bucket
const bucketPolicies = {
  'emails': [
    {
      name: 'Users can manage their own emails',
      definition: `
        (bucket_id = 'emails') AND
        (auth.uid() IS NOT NULL)
      `
    }
  ],
  'email-attachments': [
    {
      name: 'Users can manage their own attachments',
      definition: `
        (bucket_id = 'email-attachments') AND
        (auth.uid() IS NOT NULL) AND
        ((storage.foldername(name))[1] = auth.uid()::text)
      `
    }
  ],
  'user-profiles': [
    {
      name: 'Users can manage their own profiles',
      definition: `
        (bucket_id = 'user-profiles') AND
        (auth.uid() IS NOT NULL) AND
        ((storage.foldername(name))[1] = auth.uid()::text)
      `
    },
    {
      name: 'Public can view profile images',
      definition: `
        (bucket_id = 'user-profiles') AND
        (lower((storage.foldername(name))[2]) LIKE '%avatar%' OR lower((storage.foldername(name))[2]) LIKE '%cover%')
      `,
      operation: 'SELECT'
    }
  ],
  'documents': [
    {
      name: 'Users can manage their own documents',
      definition: `
        (bucket_id = 'documents') AND
        (auth.uid() IS NOT NULL) AND
        ((storage.foldername(name))[1] = auth.uid()::text)
      `
    }
  ],
  'logs': [
    {
      name: 'Admin only access to logs',
      definition: `
        (bucket_id = 'logs') AND
        (auth.uid() IS NOT NULL) AND
        (auth.jwt() ->> 'role' = 'admin')
      `
    }
  ],
  'products': [
    {
      name: 'Admin can manage product assets',
      definition: `
        (bucket_id = 'products') AND
        (auth.uid() IS NOT NULL) AND
        (auth.jwt() ->> 'role' = 'admin')
      `,
      operation: 'ALL'
    },
    {
      name: 'Public can view product assets',
      definition: `(bucket_id = 'products')`,
      operation: 'SELECT'
    }
  ],
  'chat-exports': [
    {
      name: 'Users can manage their own chat exports',
      definition: `
        (bucket_id = 'chat-exports') AND
        (auth.uid() IS NOT NULL) AND
        ((storage.foldername(name))[1] = auth.uid()::text)
      `
    }
  ],
  'drafts': [
    {
      name: 'Users can manage their own drafts',
      definition: `
        (bucket_id = 'drafts') AND
        (auth.uid() IS NOT NULL) AND
        ((storage.foldername(name))[1] = auth.uid()::text)
      `
    }
  ],
  'settings': [
    {
      name: 'Users can manage their own settings',
      definition: `
        (bucket_id = 'settings') AND
        (auth.uid() IS NOT NULL) AND
        ((storage.foldername(name))[1] = 'users' AND (storage.foldername(name))[2] = auth.uid()::text)
      `
    },
    {
      name: 'Admin can manage global settings',
      definition: `
        (bucket_id = 'settings') AND
        (auth.uid() IS NOT NULL) AND
        (auth.jwt() ->> 'role' = 'admin') AND
        ((storage.foldername(name))[1] = 'global')
      `
    },
    {
      name: 'Public can read global settings',
      definition: `
        (bucket_id = 'settings') AND
        ((storage.foldername(name))[1] = 'global')
      `,
      operation: 'SELECT'
    }
  ],
  'backups': [
    {
      name: 'Admin only access to backups',
      definition: `
        (bucket_id = 'backups') AND
        (auth.uid() IS NOT NULL) AND
        (auth.jwt() ->> 'role' = 'admin')
      `
    }
  ],
  'terms-policies': [
    {
      name: 'Admin can manage legal documents',
      definition: `
        (bucket_id = 'terms-policies') AND
        (auth.uid() IS NOT NULL) AND
        (auth.jwt() ->> 'role' = 'admin')
      `,
      operation: 'ALL'
    },
    {
      name: 'Public can read legal documents',
      definition: `(bucket_id = 'terms-policies')`,
      operation: 'SELECT'
    }
  ]
};

async function createBucket(config) {
  try {
    console.log(`📦 Creating bucket: ${config.name}`);
    
    const { data, error } = await supabase.storage.createBucket(config.id, {
      public: config.public,
      fileSizeLimit: config.fileSizeLimit,
      allowedMimeTypes: config.allowedMimeTypes
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Bucket '${config.name}' already exists`);
        return true;
      } else {
        console.error(`❌ Failed to create bucket '${config.name}':`, error.message);
        return false;
      }
    }

    console.log(`✅ Bucket '${config.name}' created successfully`);
    return true;
  } catch (err) {
    console.error(`❌ Error creating bucket '${config.name}':`, err.message);
    return false;
  }
}

async function createStoragePolicy(bucketId, policy) {
  try {
    const operation = policy.operation || 'ALL';
    const policyName = policy.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    const { error } = await supabase.rpc('create_storage_policy', {
      bucket_name: bucketId,
      policy_name: policyName,
      definition: policy.definition,
      operation: operation
    });

    if (error) {
      console.log(`⚠️  Policy "${policy.name}" may already exist or failed:`, error.message);
      return false;
    }

    console.log(`✅ Policy "${policy.name}" created for ${bucketId}`);
    return true;
  } catch (err) {
    console.log(`⚠️  Policy "${policy.name}" creation failed:`, err.message);
    return false;
  }
}

async function setupAllBuckets() {
  console.log('🚀 Setting up all 11 storage buckets...');
  console.log('=' .repeat(60));

  let successCount = 0;
  let failureCount = 0;

  // Create all buckets
  for (const config of bucketConfigs) {
    const success = await createBucket(config);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log('\n🔐 Setting up storage policies...');
  console.log('-'.repeat(40));

  // Create policies for each bucket
  for (const [bucketId, policies] of Object.entries(bucketPolicies)) {
    console.log(`\n📋 Setting up policies for ${bucketId}:`);
    
    for (const policy of policies) {
      await createStoragePolicy(bucketId, policy);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Storage setup completed!');
  console.log(`✅ Buckets created/verified: ${successCount}`);
  if (failureCount > 0) {
    console.log(`❌ Buckets failed: ${failureCount}`);
  }

  console.log('\n📋 Bucket Summary:');
  console.log('-'.repeat(40));
  
  bucketConfigs.forEach(config => {
    const sizeInMB = (config.fileSizeLimit / (1024 * 1024)).toFixed(0);
    const visibility = config.public ? 'Public' : 'Private';
    console.log(`• ${config.name.padEnd(20)} | ${sizeInMB.padStart(3)}MB | ${visibility.padEnd(7)} | ${config.description}`);
  });

  console.log('\n🔗 Next steps:');
  console.log('   1. Test bucket access with your application');
  console.log('   2. Upload sample files to verify functionality');
  console.log('   3. Check Row Level Security policies in Supabase dashboard');
  console.log('   4. Monitor storage usage and costs');
  
  console.log('\n📖 Usage:');
  console.log('   Import storage classes: import StorageManager from "@/utils/supabase-storage-manager"');
  console.log('   Example: await StorageManager.emails.uploadEmailLog(emailData, userId)');
}

// Manual SQL setup (fallback)
function printManualSetup() {
  console.log('\n📝 Manual SQL Setup (if automated setup fails):');
  console.log('=' .repeat(60));
  console.log('Run these commands in your Supabase SQL Editor:\n');

  // Create buckets SQL
  console.log('-- Create storage buckets');
  bucketConfigs.forEach(config => {
    console.log(`INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)`);
    console.log(`VALUES ('${config.id}', '${config.name}', ${config.public}, ${config.fileSizeLimit}, ARRAY[${config.allowedMimeTypes.map(type => `'${type}'`).join(', ')}])`);
    console.log(`ON CONFLICT (id) DO NOTHING;\n`);
  });

  // Create policies SQL
  console.log('-- Create storage policies');
  Object.entries(bucketPolicies).forEach(([bucketId, policies]) => {
    policies.forEach(policy => {
      const operation = policy.operation || 'ALL';
      const policyName = policy.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      console.log(`CREATE POLICY "${policyName}" ON storage.objects`);
      console.log(`FOR ${operation} USING (${policy.definition.trim()});\n`);
    });
  });
}

// Run setup
if (require.main === module) {
  setupAllBuckets()
    .then(() => {
      printManualSetup();
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Setup failed:', err);
      printManualSetup();
      process.exit(1);
    });
}

module.exports = {
  setupAllBuckets,
  bucketConfigs,
  bucketPolicies
};