const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPurchaseLinking() {
  console.log('Testing purchase linking system...');
  
  try {
    // Get all purchases with their details
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching purchases:', error);
      return;
    }
    
    console.log(`\nFound ${purchases.length} purchases:`);
    
    // Group purchases by user_id and customer_email
    const userPurchases = {};
    const emailPurchases = {};
    
    purchases.forEach(purchase => {
      // Group by user_id
      if (purchase.user_id) {
        if (!userPurchases[purchase.user_id]) {
          userPurchases[purchase.user_id] = [];
        }
        userPurchases[purchase.user_id].push(purchase);
      }
      
      // Group by customer_email
      if (purchase.customer_email) {
        if (!emailPurchases[purchase.customer_email]) {
          emailPurchases[purchase.customer_email] = [];
        }
        emailPurchases[purchase.customer_email].push(purchase);
      }
    });
    
    console.log('\n=== PURCHASES BY USER ID ===');
    Object.keys(userPurchases).forEach(userId => {
      const userPurchaseList = userPurchases[userId];
      console.log(`\nUser ID: ${userId}`);
      console.log(`Email: ${userPurchaseList[0].customer_email}`);
      console.log(`Total purchases: ${userPurchaseList.length}`);
      userPurchaseList.forEach(purchase => {
        console.log(`  - ${purchase.product_name} (${purchase.product_id}) - $${purchase.price} - ${purchase.created_at}`);
        if (purchase.payment_email && purchase.payment_email !== purchase.customer_email) {
          console.log(`    Payment email: ${purchase.payment_email}`);
        }
      });
    });
    
    console.log('\n=== PURCHASES BY EMAIL ===');
    Object.keys(emailPurchases).forEach(email => {
      const emailPurchaseList = emailPurchases[email];
      console.log(`\nEmail: ${email}`);
      console.log(`Total purchases: ${emailPurchaseList.length}`);
      
      // Check if all purchases for this email have the same user_id
      const userIds = [...new Set(emailPurchaseList.map(p => p.user_id).filter(Boolean))];
      if (userIds.length > 1) {
        console.log(`  ⚠️  WARNING: Multiple user IDs for same email: ${userIds.join(', ')}`);
      } else if (userIds.length === 1) {
        console.log(`  ✅ All purchases linked to user ID: ${userIds[0]}`);
      } else {
        console.log(`  ❌ No user ID linked (guest purchases)`);
      }
      
      emailPurchaseList.forEach(purchase => {
        console.log(`  - ${purchase.product_name} (${purchase.product_id}) - User: ${purchase.user_id || 'None'} - $${purchase.price}`);
      });
    });
    
    // Check for potential linking issues
    console.log('\n=== POTENTIAL ISSUES ===');
    
    // Find purchases without user_id
    const unlinkedPurchases = purchases.filter(p => !p.user_id);
    if (unlinkedPurchases.length > 0) {
      console.log(`\n❌ Found ${unlinkedPurchases.length} unlinked purchases:`);
      unlinkedPurchases.forEach(purchase => {
        console.log(`  - ${purchase.customer_email}: ${purchase.product_name} (${purchase.created_at})`);
      });
    } else {
      console.log('\n✅ All purchases are linked to user accounts');
    }
    
    // Find purchases where payment_email differs from customer_email
    const emailMismatches = purchases.filter(p => p.payment_email && p.payment_email !== p.customer_email);
    if (emailMismatches.length > 0) {
      console.log(`\n⚠️  Found ${emailMismatches.length} purchases with email mismatches:`);
      emailMismatches.forEach(purchase => {
        console.log(`  - Customer: ${purchase.customer_email}, Payment: ${purchase.payment_email} - ${purchase.product_name}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing purchase linking:', error);
  }
}

testPurchaseLinking();