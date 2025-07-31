const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixUserAccess() {
  console.log('🔧 Fixing user access issues...');

  try {
    // 1. Fix christroiano1993@hotmail.com access
    console.log('\n👤 Fixing christroiano1993@hotmail.com access...');
    
    // Get user from auth
    const { data: hotmailUser, error: hotmailUserError } = await supabase.auth.admin.listUsers();
    const foundHotmailUser = hotmailUser?.users?.find(user => user.email === 'christroiano1993@hotmail.com');
    
    if (hotmailUserError || !foundHotmailUser) {
      console.error('❌ Could not find hotmail user:', hotmailUserError);
      return;
    }

    console.log(`✅ Found user: ${foundHotmailUser.id}`);

    // Check existing purchase
    const { data: existingPurchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', 'christroiano1993@hotmail.com')
      .eq('product_id', 'prompts')
      .single();

    if (purchaseError && purchaseError.code !== 'PGRST116') {
      console.error('❌ Error checking purchase:', purchaseError);
    }

    if (!existingPurchase) {
      // Create purchase record
      const { error: createError } = await supabase
        .from('purchases')
        .insert({
          user_id: foundHotmailUser.id,
          product_id: 'prompts',
          product_name: 'AI Prompts Arsenal 2025',
          amount: 10.00,
          currency: 'USD',
          status: 'completed',
          order_number: 'manual-fix-' + Date.now(),
          customer_email: 'christroiano1993@hotmail.com',
          created_at: new Date().toISOString()
        });

      if (createError) {
        console.error('❌ Error creating purchase:', createError);
      } else {
        console.log('✅ Purchase record created for hotmail user');
      }
    } else {
      // Update existing purchase to link user_id
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ user_id: foundHotmailUser.id })
        .eq('id', existingPurchase.id);

      if (updateError) {
        console.error('❌ Error updating purchase:', updateError);
      } else {
        console.log('✅ Purchase record updated for hotmail user');
      }
    }

    // Reset password for hotmail user
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      foundHotmailUser.id,
      { password: 'Rabbit5511$$11' }
    );

    if (passwordError) {
      console.error('❌ Error updating password:', passwordError);
    } else {
      console.log('✅ Password updated for hotmail user');
    }

    // 2. Fix christroiano1993@gmail.com access
    console.log('\n👤 Fixing christroiano1993@gmail.com access...');
    
    const { data: gmailUser, error: gmailUserError } = await supabase.auth.admin.listUsers();
    const foundGmailUser = gmailUser?.users?.find(user => user.email === 'christroiano1993@gmail.com');
    
    if (gmailUserError || !foundGmailUser) {
      console.error('❌ Could not find gmail user:', gmailUserError);
      return;
    }

    console.log(`✅ Found user: ${foundGmailUser.id}`);

    // Check existing purchase
    const { data: gmailPurchase, error: gmailPurchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', 'christroiano1993@gmail.com')
      .eq('product_id', 'ebook')
      .single();

    if (gmailPurchaseError && gmailPurchaseError.code !== 'PGRST116') {
      console.error('❌ Error checking gmail purchase:', gmailPurchaseError);
    }

    if (!gmailPurchase) {
      // Create purchase record
      const { error: createError } = await supabase
        .from('purchases')
        .insert({
          user_id: foundGmailUser.id,
          product_id: 'ebook',
          product_name: 'AI Tools Mastery Guide 2025',
          amount: 10.00,
          currency: 'USD',
          status: 'completed',
          order_number: 'manual-fix-' + Date.now(),
          customer_email: 'christroiano1993@gmail.com',
          created_at: new Date().toISOString()
        });

      if (createError) {
        console.error('❌ Error creating gmail purchase:', createError);
      } else {
        console.log('✅ Purchase record created for gmail user');
      }
    } else {
      // Update existing purchase to link user_id
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ user_id: foundGmailUser.id })
        .eq('id', gmailPurchase.id);

      if (updateError) {
        console.error('❌ Error updating gmail purchase:', updateError);
      } else {
        console.log('✅ Purchase record updated for gmail user');
      }
    }

    // 3. Verify all purchases are properly linked
    console.log('\n🔍 Verifying all purchases...');
    
    const { data: allPurchases, error: allPurchasesError } = await supabase
      .from('purchases')
      .select('*')
      .in('customer_email', ['christroiano1993@gmail.com', 'christroiano1993@hotmail.com']);

    if (allPurchasesError) {
      console.error('❌ Error fetching purchases:', allPurchasesError);
    } else {
      console.log('\n📋 Current purchase records:');
      allPurchases.forEach(purchase => {
        console.log(`   📦 ${purchase.product_name}`);
        console.log(`      📧 Email: ${purchase.customer_email}`);
        console.log(`      🆔 Product ID: ${purchase.product_id}`);
        console.log(`      👤 User ID: ${purchase.user_id || 'NOT LINKED'}`);
        console.log(`      ✅ Status: ${purchase.status}`);
        console.log('      ---');
      });
    }

    console.log('\n✅ User access fix completed!');
    console.log('\n🔐 Login credentials:');
    console.log('   📧 christroiano1993@gmail.com - Password: Rabbit5511$$11');
    console.log('   📧 christroiano1993@hotmail.com - Password: Rabbit5511$$11');
    console.log('\n🌐 Test at: http://localhost:3003/login');

  } catch (error) {
    console.error('❌ Error fixing user access:', error);
  }
}

fixUserAccess();