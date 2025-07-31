const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestPurchases() {
  console.log('Creating test purchases for existing users...');
  
  try {
    // Get all users first
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return false;
    }
    
    console.log(`Found ${users.length} users`);
    
    // Sample products (matching the setup-sample-products.sql)
    const sampleProducts = [
      {
        id: 'ebook-productivity-guide',
        name: 'The Ultimate Productivity Guide',
        price: 29.99,
        download_url: '/downloads/productivity-guide.pdf'
      },
      {
        id: 'course-web-development',
        name: 'Complete Web Development Course',
        price: 99.99,
        download_url: '/downloads/web-dev-course.zip'
      },
      {
        id: 'template-business-plan',
        name: 'Professional Business Plan Template',
        price: 19.99,
        download_url: '/downloads/business-plan-template.docx'
      },
      {
        id: 'software-photo-editor',
        name: 'Advanced Photo Editor Pro',
        price: 79.99,
        download_url: '/downloads/photo-editor-pro.dmg'
      },
      {
        id: 'music-meditation-pack',
        name: 'Meditation Music Collection',
        price: 14.99,
        download_url: '/downloads/meditation-music.zip'
      },
      {
        id: 'graphics-icon-set',
        name: 'Premium Icon Set (500+ Icons)',
        price: 24.99,
        download_url: '/downloads/premium-icons.zip'
      }
    ];
    
    // Create purchases for each user
    const purchasePromises = [];
    
    users.forEach((user, userIndex) => {
      // Give each user 2-3 random products
      const numPurchases = Math.floor(Math.random() * 2) + 2; // 2-3 purchases
      const userProducts = sampleProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, numPurchases);
      
      userProducts.forEach((product, productIndex) => {
        const purchase = {
          user_id: user.id,
          customer_email: user.email,
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          session_id: `test-session-${user.id.substring(0, 8)}-${productIndex}`,
          download_url: product.download_url,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 7 days
        };
        
        purchasePromises.push(
          supabase.from('purchases').insert(purchase)
        );
      });
    });
    
    console.log(`Creating ${purchasePromises.length} test purchases...`);
    
    // Execute all purchase insertions
    const results = await Promise.allSettled(purchasePromises);
    
    let successCount = 0;
    let errorCount = 0;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        successCount++;
      } else {
        errorCount++;
        console.error(`Purchase ${index + 1} failed:`, result.reason || result.value?.error);
      }
    });
    
    console.log(`\n✅ Successfully created ${successCount} purchases`);
    if (errorCount > 0) {
      console.log(`❌ Failed to create ${errorCount} purchases`);
    }
    
    // Verify the purchases were created
    const { data: allPurchases, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('Error fetching purchases:', fetchError);
      return false;
    }
    
    console.log(`\n📊 Total purchases in database: ${allPurchases.length}`);
    
    // Group by user
    const purchasesByUser = {};
    allPurchases.forEach(purchase => {
      if (!purchasesByUser[purchase.customer_email]) {
        purchasesByUser[purchase.customer_email] = [];
      }
      purchasesByUser[purchase.customer_email].push(purchase);
    });
    
    console.log('\n👥 Purchases by user:');
    Object.entries(purchasesByUser).forEach(([email, purchases]) => {
      console.log(`   ${email}: ${purchases.length} purchases`);
      purchases.forEach(p => {
        console.log(`     - ${p.product_name} ($${p.price})`);
      });
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

createTestPurchases().then(success => {
  if (success) {
    console.log('\n🎉 Test purchases created successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Users should now be able to see their purchases in "My Account"');
    console.log('   2. Test the /my-account page to verify access');
    console.log('   3. Check that download links work properly');
  } else {
    console.log('\n❌ Failed to create test purchases!');
  }
  process.exit(success ? 0 : 1);
});