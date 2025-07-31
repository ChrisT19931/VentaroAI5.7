// Simple script to check recent purchases using the same approach as the API
const { createClient } = require('@supabase/supabase-js');

function getSupabaseAdmin() {
  const supabaseUrl = 'https://bamqdxclctzwyplecoxt.supabase.co/';
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbXFkeGNsY3R6d3lwbGVjb3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE4MjEzOSwiZXhwIjoyMDY4NzU4MTM5fQ.CXjE_ervKvj8ySUEYRbIUSrTQWhC-fy0VpMziKZNA2A';
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function checkRecentPurchases() {
  try {
    console.log('🔍 Checking recent purchases...');
    
    const adminClient = getSupabaseAdmin();
    
    // Get the 10 most recent purchases
    const { data: purchases, error } = await adminClient
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching purchases:', error);
      return;
    }

    console.log(`\n📊 Found ${purchases.length} recent purchases:`);
    
    if (purchases.length === 0) {
      console.log('   No purchases found.');
      return;
    }
    
    purchases.forEach((purchase, index) => {
      console.log(`\n${index + 1}. Purchase ID: ${purchase.id}`);
      console.log(`   Customer Email: ${purchase.customer_email}`);
      console.log(`   Product: ${purchase.product_name} (${purchase.product_id})`);
      console.log(`   Price: $${purchase.price}`);
      console.log(`   User ID: ${purchase.user_id || 'Not linked'}`);
      console.log(`   Session ID: ${purchase.session_id || 'N/A'}`);
      console.log(`   Created: ${new Date(purchase.created_at).toLocaleString()}`);
    });

    // Check for purchases without user_id (unlinked accounts)
    const unlinkedPurchases = purchases.filter(p => !p.user_id);
    if (unlinkedPurchases.length > 0) {
      console.log(`\n⚠️  Found ${unlinkedPurchases.length} purchases without linked user accounts:`);
      unlinkedPurchases.forEach(purchase => {
        console.log(`   - ${purchase.customer_email} (${purchase.product_name})`);
      });
    }

    // Check for the most recent purchase
    const mostRecent = purchases[0];
    console.log(`\n🆕 Most recent purchase:`);
    console.log(`   Email: ${mostRecent.customer_email}`);
    console.log(`   Product: ${mostRecent.product_name}`);
    console.log(`   User linked: ${mostRecent.user_id ? 'Yes' : 'No'}`);
    
    if (!mostRecent.user_id) {
      console.log(`\n🔧 This purchase needs to be linked to a user account.`);
      console.log(`   📝 User should sign up with email: ${mostRecent.customer_email}`);
      console.log(`   💡 Once they sign up, the system will automatically link their purchases.`);
    } else {
      console.log(`\n✅ Most recent purchase is properly linked to user account.`);
    }

  } catch (error) {
    console.error('❌ Script error:', error.message);
    console.error('Full error:', error);
  }
}

checkRecentPurchases().then(() => {
  console.log('\n✨ Check complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});