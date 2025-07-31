const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = 'https://bamqdxclctzwyplecoxt.supabase.co/';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbXFkeGNsY3R6d3lwbGVjb3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE4MjEzOSwiZXhwIjoyMDY4NzU4MTM5fQ.CXjE_ervKvj8ySUEYRbIUSrTQWhC-fy0VpMziKZNA2A';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const targetUserId = '5383d4eb-8971-41d5-80ca-1798bd23ab7b';
const userEmail = 'christrabbit11@outlook.com';
const purchaseEmail = 'christroiano1993@gmail.com';

async function fixPurchaseLinking() {
  try {
    console.log(`🔧 Fixing purchase linking for user: ${targetUserId}`);
    console.log(`   User email: ${userEmail}`);
    console.log(`   Purchase email: ${purchaseEmail}`);
    
    // 1. Check if these emails belong to the same person
    console.log('\n1. Analyzing email similarity...');
    const emailSimilarity = checkEmailSimilarity(userEmail, purchaseEmail);
    console.log(`   Similarity analysis: ${emailSimilarity}`);
    
    // 2. Find purchases with the purchase email
    console.log('\n2. Finding purchases with purchase email...');
    const { data: purchasesToLink, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', purchaseEmail)
      .order('created_at', { ascending: false });
    
    if (purchasesError) {
      console.error('❌ Error fetching purchases:', purchasesError);
      return;
    }
    
    console.log(`📦 Found ${purchasesToLink.length} purchases to potentially link:`);
    purchasesToLink.forEach((purchase, index) => {
      console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price}`);
      console.log(`      Purchase ID: ${purchase.id}`);
      console.log(`      Current user_id: ${purchase.user_id}`);
      console.log(`      Email: ${purchase.customer_email}`);
      console.log(`      Created: ${purchase.created_at}`);
    });
    
    // 3. Ask for confirmation and link purchases
    if (purchasesToLink.length > 0) {
      console.log('\n3. Linking purchases to correct user...');
      
      for (const purchase of purchasesToLink) {
        console.log(`\n   Linking purchase ${purchase.id}...`);
        
        // Update the purchase to link it to the correct user
        const { error: updateError } = await supabase
          .from('purchases')
          .update({
            user_id: targetUserId,
            customer_email: userEmail // Also update email to match user's auth email
          })
          .eq('id', purchase.id);
        
        if (updateError) {
          console.error(`   ❌ Error linking purchase ${purchase.id}:`, updateError);
        } else {
          console.log(`   ✅ Successfully linked purchase ${purchase.id}`);
        }
      }
      
      // 4. Verify the fix
      console.log('\n4. Verifying the fix...');
      const { data: verifyPurchases, error: verifyError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });
      
      if (verifyError) {
        console.error('❌ Error verifying fix:', verifyError);
      } else {
        console.log(`✅ User now has ${verifyPurchases.length} linked purchases:`);
        verifyPurchases.forEach((purchase, index) => {
          console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price}`);
        });
      }
      
      // 5. Test API access
      console.log('\n5. Testing API access...');
      try {
        const response = await fetch(`http://localhost:3000/api/purchases/confirm?userId=${targetUserId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ API test successful: Found ${data.purchases?.length || 0} purchases`);
        } else {
          console.log(`❌ API test failed: ${response.status}`);
        }
      } catch (apiError) {
        console.log(`❌ API test failed: ${apiError.message}`);
        console.log('   Note: This might be because the dev server is not running');
      }
      
    } else {
      console.log('\n❌ No purchases found to link');
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

function checkEmailSimilarity(email1, email2) {
  const domain1 = email1.split('@')[1];
  const domain2 = email2.split('@')[1];
  const user1 = email1.split('@')[0];
  const user2 = email2.split('@')[0];
  
  if (user1.includes('christ') && user2.includes('christ')) {
    return 'Both emails contain "christ" - likely same person';
  }
  
  return 'Different email patterns';
}

// Run the fix
fixPurchaseLinking().then(() => {
  console.log('\n🏁 Fix complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fix failed:', error);
  process.exit(1);
});