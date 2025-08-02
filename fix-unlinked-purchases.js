require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function fixUnlinkedPurchases() {
  console.log('🔧 Fixing unlinked purchases...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // 1. Get all unlinked purchases
    const { data: unlinkedPurchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .is('user_id', null);
    
    if (purchasesError) {
      console.error('❌ Error fetching unlinked purchases:', purchasesError);
      return;
    }
    
    console.log(`Found ${unlinkedPurchases.length} unlinked purchases`);
    
    if (unlinkedPurchases.length === 0) {
      console.log('✅ No unlinked purchases to fix');
      return;
    }
    
    // 2. Group by email
    const purchasesByEmail = {};
    unlinkedPurchases.forEach(purchase => {
      const email = purchase.customer_email;
      if (!purchasesByEmail[email]) {
        purchasesByEmail[email] = [];
      }
      purchasesByEmail[email].push(purchase);
    });
    
    console.log(`Unlinked purchases from ${Object.keys(purchasesByEmail).length} different emails`);
    
    // 3. Try to link each email to existing users
    for (const [email, purchases] of Object.entries(purchasesByEmail)) {
      console.log(`\n🔍 Processing ${purchases.length} purchases for ${email}`);
      
      // Try to find user by email
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('❌ Error fetching users:', usersError);
        continue;
      }
      
      const matchingUser = users.users.find(user => user.email === email);
      
      if (matchingUser) {
        console.log(`✅ Found matching user: ${matchingUser.id}`);
        
        // Update all purchases for this email
        const purchaseIds = purchases.map(p => p.id);
        const { error: updateError } = await supabase
          .from('purchases')
          .update({ user_id: matchingUser.id })
          .in('id', purchaseIds);
        
        if (updateError) {
          console.error('❌ Error updating purchases:', updateError);
        } else {
          console.log(`✅ Linked ${purchases.length} purchases to user ${matchingUser.id}`);
        }
      } else {
        console.log(`⚠️  No registered user found for ${email}`);
        console.log('   These purchases will remain unlinked until user registers');
      }
    }
    
    // 4. Final verification
    console.log('\n📊 Final verification...');
    const { data: remainingUnlinked, error: verifyError } = await supabase
      .from('purchases')
      .select('*')
      .is('user_id', null);
    
    if (verifyError) {
      console.error('❌ Error verifying results:', verifyError);
    } else {
      console.log(`Remaining unlinked purchases: ${remainingUnlinked.length}`);
      if (remainingUnlinked.length > 0) {
        console.log('Emails with unlinked purchases:');
        remainingUnlinked.forEach(p => {
          console.log(`  - ${p.customer_email} (${p.product_id})`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

fixUnlinkedPurchases();