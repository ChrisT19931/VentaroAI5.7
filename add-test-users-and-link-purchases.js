require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
const adminSupabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addTestUsersAndLink() {
  const testUsers = [
    { email: 'christroiano1993@hotmail.com', password: 'testpassword' },
    { email: 'christroiano1993@gmail.com', password: 'testpassword' }
  ];

  for (const userData of testUsers) {
    let userId;
    // Try to create user
    let { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    });
    if (createError) {
      if (createError.code === 'email_exists') {
        // User exists, get user ID
        const { data: users, error: listError } = await adminSupabase.auth.admin.listUsers();
        if (listError) {
          console.error(`Error listing users:`, listError);
          continue;
        }
        const existing = users.users.find(u => u.email === userData.email);
        if (existing) {
          userId = existing.id;
          console.log(`User already exists: ${userData.email}, ID: ${userId}`);
        } else {
          console.error(`User exists but not found in list for ${userData.email}`);
          continue;
        }
      } else {
        console.error(`Error creating user ${userData.email}:`, createError);
        continue;
      }
    } else {
      userId = newUser.user.id;
      console.log(`Created user: ${userData.email}, ID: ${userId}`);
    }

    // Link purchases: update purchases with matching customer_email to set user_id
const { data: allPurchases, error: allError } = await adminSupabase.from('purchases').select('*').eq('customer_email', userData.email);
if (allError) {
  console.error(`Error fetching all purchases for ${userData.email}:`, allError);
} else {
  console.log(`Found ${allPurchases.length} total purchases for ${userData.email}`);
  console.log('Purchases details:', allPurchases);
}
const { data: purchases, error: fetchError } = await adminSupabase.from('purchases').select('*').eq('customer_email', userData.email).is('user_id', null);
    if (fetchError) {
      console.error(`Error fetching purchases for ${userData.email}:`, fetchError);
      continue;
    }
    if (purchases.length > 0) {
      const { error: updateError } = await adminSupabase.from('purchases').update({ user_id: userId }).eq('customer_email', userData.email).is('user_id', null);
      if (updateError) {
          console.error(`Error linking purchases for ${userData.email}:`, updateError);
        } else {
          console.log(`Linked ${purchases.length} purchases to user ${userData.email}`);
          // Verify update
          const { data: updatedPurchases, error: verifyError } = await adminSupabase.from('purchases').select('id, user_id').eq('customer_email', userData.email);
          if (verifyError) {
            console.error(`Error verifying update for ${userData.email}:`, verifyError);
          } else {
            console.log(`Verified purchases for ${userData.email}:`, updatedPurchases);
          }
        }
    } else {
      console.log(`No guest purchases to link for ${userData.email}`);
    }
  }
}

addTestUsersAndLink().then(() => console.log('Done')).catch(console.error);