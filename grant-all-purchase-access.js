require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Product mapping for consistent access
const PRODUCT_MAPPING = {
  'ebook': {
    id: 'ebook',
    name: 'AI Tools Mastery Guide 2025',
    aliases: ['1', 'ai-tools-mastery-guide-2025']
  },
  'prompts': {
    id: 'prompts', 
    name: 'AI Prompts Arsenal 2025',
    aliases: ['2', 'ai-prompts-arsenal-2025']
  },
  'coaching': {
    id: 'coaching',
    name: 'AI Business Strategy Coaching',
    aliases: ['3', 'ai-business-strategy-coaching']
  }
};

async function grantAllPurchaseAccess() {
  console.log('🚀 Starting comprehensive purchase access grant...');
  console.log('📋 This script will:');
  console.log('   1. Find all existing purchases in the database');
  console.log('   2. Link purchases to user accounts where possible');
  console.log('   3. Create missing purchase records for known customers');
  console.log('   4. Verify webhook system for future automatic access');
  console.log('');

  try {
    // Step 1: Get all existing purchases
    console.log('📊 Step 1: Analyzing existing purchases...');
    const { data: allPurchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    if (purchasesError) {
      console.error('❌ Error fetching purchases:', purchasesError);
      return;
    }

    console.log(`   Found ${allPurchases.length} existing purchase records`);
    
    // Step 2: Get all users from auth
    console.log('\n👥 Step 2: Analyzing user accounts...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching users:', authError);
      return;
    }

    const users = authData.users || [];
    console.log(`   Found ${users.length} user accounts`);

    // Step 3: Link existing purchases to user accounts
    console.log('\n🔗 Step 3: Linking purchases to user accounts...');
    let linkedCount = 0;
    let alreadyLinkedCount = 0;

    for (const purchase of allPurchases) {
      if (!purchase.user_id && purchase.customer_email) {
        // Find matching user by email
        const matchingUser = users.find(user => user.email === purchase.customer_email);
        
        if (matchingUser) {
          const { error: updateError } = await supabase
            .from('purchases')
            .update({ user_id: matchingUser.id })
            .eq('id', purchase.id);

          if (updateError) {
            console.error(`   ❌ Failed to link purchase ${purchase.id}:`, updateError);
          } else {
            console.log(`   ✅ Linked purchase for ${purchase.customer_email} to user ${matchingUser.id}`);
            linkedCount++;
          }
        }
      } else if (purchase.user_id) {
        alreadyLinkedCount++;
      }
    }

    console.log(`   📈 Results: ${linkedCount} newly linked, ${alreadyLinkedCount} already linked`);

    // Step 4: Create missing purchase records for known customers
    console.log('\n📝 Step 4: Creating missing purchase records...');
    
    // Known customers who should have access (add more as needed)
    const knownCustomers = [
      {
        email: 'christroiano1993@gmail.com',
        products: ['ebook'] // AI Tools Mastery Guide
      },
      {
        email: 'christroiano1993@hotmail.com', 
        products: ['prompts'] // AI Prompts Arsenal
      }
      // Add more customers here as needed
    ];

    let createdCount = 0;
    
    for (const customer of knownCustomers) {
      const user = users.find(u => u.email === customer.email);
      
      for (const productId of customer.products) {
        // Check if purchase already exists
        const existingPurchase = allPurchases.find(p => 
          p.customer_email === customer.email && p.product_id === productId
        );

        if (!existingPurchase) {
          const product = PRODUCT_MAPPING[productId];
          if (!product) {
            console.log(`   ⚠️  Unknown product ID: ${productId}`);
            continue;
          }

          const { error: createError } = await supabase
            .from('purchases')
            .insert({
              user_id: user?.id || null,
              customer_email: customer.email,
              product_id: product.id,
              product_name: product.name,
              price: 10.00, // Default price
              session_id: `manual-grant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              created_at: new Date().toISOString()
            });

          if (createError) {
            console.error(`   ❌ Failed to create purchase for ${customer.email} (${product.name}):`, createError);
          } else {
            console.log(`   ✅ Created purchase record: ${customer.email} → ${product.name}`);
            createdCount++;
          }
        } else {
          console.log(`   ℹ️  Purchase already exists: ${customer.email} → ${productId}`);
        }
      }
    }

    console.log(`   📈 Created ${createdCount} new purchase records`);

    // Step 5: Verify webhook system for future purchases
    console.log('\n🔧 Step 5: Verifying webhook system...');
    
    // Check if webhook secret is configured
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret || webhookSecret.includes('placeholder')) {
      console.log('   ⚠️  STRIPE_WEBHOOK_SECRET not configured - future purchases may not auto-link');
      console.log('   💡 To fix: Set STRIPE_WEBHOOK_SECRET in your .env.local file');
    } else {
      console.log('   ✅ Webhook secret configured');
    }

    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes('placeholder')) {
      console.log('   ⚠️  STRIPE_SECRET_KEY not configured - payments may not work');
    } else {
      console.log('   ✅ Stripe secret key configured');
    }

    // Step 6: Final verification
    console.log('\n🔍 Step 6: Final verification...');
    
    const { data: finalPurchases, error: finalError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    if (finalError) {
      console.error('❌ Error in final verification:', finalError);
      return;
    }

    console.log(`\n📊 Final Statistics:`);
    console.log(`   📦 Total purchases: ${finalPurchases.length}`);
    console.log(`   🔗 Linked to users: ${finalPurchases.filter(p => p.user_id).length}`);
    console.log(`   📧 Guest purchases: ${finalPurchases.filter(p => !p.user_id).length}`);
    
    // Group by product
    const productStats = {};
    finalPurchases.forEach(purchase => {
      const productId = purchase.product_id || 'unknown';
      if (!productStats[productId]) {
        productStats[productId] = 0;
      }
      productStats[productId]++;
    });

    console.log(`\n📈 Purchases by product:`);
    Object.entries(productStats).forEach(([productId, count]) => {
      const product = PRODUCT_MAPPING[productId];
      const name = product ? product.name : productId;
      console.log(`   📦 ${name}: ${count} purchases`);
    });

    // Show recent purchases
    console.log(`\n🆕 Recent purchases (last 5):`);
    finalPurchases.slice(0, 5).forEach((purchase, index) => {
      const product = PRODUCT_MAPPING[purchase.product_id];
      const productName = product ? product.name : purchase.product_name || purchase.product_id;
      console.log(`   ${index + 1}. ${purchase.customer_email} → ${productName} ${purchase.user_id ? '(linked)' : '(guest)'}`); 
    });

    console.log('\n✅ Purchase access grant completed successfully!');
    console.log('\n🎯 Next steps:');
    console.log('   1. Test user login and product access at: http://localhost:3004/login');
    console.log('   2. Verify downloads work at: http://localhost:3004/downloads');
    console.log('   3. Test new purchases to ensure automatic access');
    console.log('   4. Monitor webhook logs for future purchase processing');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
grantAllPurchaseAccess().then(() => {
  console.log('\n🏁 Script execution completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});