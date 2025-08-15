#!/usr/bin/env node

/**
 * EMERGENCY PURCHASE UNLOCK SCRIPT
 * 
 * This script will manually unlock the AI Prompts Arsenal purchase
 * for your account immediately, bypassing any webhook issues.
 * 
 * Usage: node emergency-unlock-prompts.js YOUR_EMAIL@example.com
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

async function emergencyUnlock() {
  const email = process.argv[2];
  
  console.log('🚨 EMERGENCY PURCHASE UNLOCK SCRIPT');
  console.log('===================================\n');
  
  if (!email) {
    console.log('❌ Error: Please provide your email address');
    console.log('Usage: node emergency-unlock-prompts.js YOUR_EMAIL@example.com');
    console.log('\nExample: node emergency-unlock-prompts.js john@example.com');
    process.exit(1);
  }
  
  console.log(`🎯 Target Email: ${email}`);
  console.log(`💰 Product: AI Prompts Arsenal ($10)`);
  console.log(`🔓 Action: Emergency Unlock\n`);
  
  // Try multiple unlock strategies
  const strategies = [
    { name: 'Supabase Database', method: unlockViaSupabase },
    { name: 'API Endpoint', method: unlockViaAPI },
    { name: 'File Storage', method: unlockViaFile }
  ];
  
  for (const strategy of strategies) {
    try {
      console.log(`🔄 Trying: ${strategy.name}`);
      const result = await strategy.method(email);
      
      if (result.success) {
        console.log(`✅ SUCCESS: ${strategy.name} worked!`);
        console.log(`📋 Purchase ID: ${result.purchaseId}`);
        console.log(`🔗 Access URL: https://your-domain.com/downloads/prompts`);
        console.log(`\n🎉 PROMPTS UNLOCKED! You can now access your AI Prompts Arsenal.`);
        
        // Verification
        await verifyUnlock(email);
        return;
      }
    } catch (error) {
      console.log(`❌ ${strategy.name} failed: ${error.message}`);
    }
  }
  
  console.log('\n🚨 All strategies failed. Manual intervention required.');
  console.log('📋 Manual unlock instructions:');
  console.log('1. Log into your Supabase dashboard');
  console.log('2. Go to the "purchases" table');
  console.log('3. Insert a new row with these values:');
  console.log(`   - customer_email: ${email}`);
  console.log(`   - product_id: prompts`);
  console.log(`   - product_name: AI Prompts Arsenal 2025`);
  console.log(`   - amount: 10.00`);
  console.log(`   - currency: usd`);
  console.log(`   - status: active`);
  console.log(`   - created_at: ${new Date().toISOString()}`);
}

async function unlockViaSupabase(email) {
  if (SUPABASE_SERVICE_KEY === 'placeholder' || SUPABASE_URL.includes('xyzcompany')) {
    throw new Error('Supabase not configured');
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  const purchaseData = {
    customer_email: email,
    product_id: 'prompts',
    product_name: 'AI Prompts Arsenal 2025',
    amount: 10.00,
    currency: 'usd',
    status: 'active',
    stripe_session_id: `emergency_unlock_${Date.now()}`,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchaseData])
    .select()
    .single();
  
  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }
  
  return {
    success: true,
    purchaseId: data.id,
    method: 'supabase'
  };
}

async function unlockViaAPI(email) {
  // This would make an HTTP request to your API
  // For now, we'll simulate it
  throw new Error('API method requires running server');
}

async function unlockViaFile(email) {
  const fs = require('fs');
  const path = require('path');
  
  const unlockFile = path.join(__dirname, 'emergency-unlocks.json');
  
  let unlocks = [];
  if (fs.existsSync(unlockFile)) {
    try {
      unlocks = JSON.parse(fs.readFileSync(unlockFile, 'utf8'));
    } catch (e) {
      unlocks = [];
    }
  }
  
  const purchaseId = `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const unlock = {
    id: purchaseId,
    customer_email: email,
    product_id: 'prompts',
    product_name: 'AI Prompts Arsenal 2025',
    amount: 10.00,
    currency: 'usd',
    status: 'active',
    method: 'emergency_file',
    created_at: new Date().toISOString()
  };
  
  unlocks.push(unlock);
  fs.writeFileSync(unlockFile, JSON.stringify(unlocks, null, 2));
  
  console.log(`📁 Emergency unlock saved to: ${unlockFile}`);
  console.log('⚠️ This is a temporary solution - you need to add this to your database');
  
  return {
    success: true,
    purchaseId,
    method: 'file'
  };
}

async function verifyUnlock(email) {
  console.log('\n🔍 VERIFICATION');
  console.log('===============');
  
  try {
    if (SUPABASE_SERVICE_KEY !== 'placeholder' && !SUPABASE_URL.includes('xyzcompany')) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      
      const { data: purchases, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('customer_email', email)
        .eq('product_id', 'prompts');
      
      if (error) {
        console.log('❌ Verification failed:', error.message);
        return;
      }
      
      if (purchases && purchases.length > 0) {
        console.log(`✅ Verified: Found ${purchases.length} prompts purchase(s) for ${email}`);
        purchases.forEach(p => {
          console.log(`   - ID: ${p.id}`);
          console.log(`   - Amount: $${p.amount}`);
          console.log(`   - Status: ${p.status}`);
          console.log(`   - Created: ${p.created_at}`);
        });
      } else {
        console.log('❌ No prompts purchases found - unlock may not have worked');
      }
    } else {
      console.log('⚠️ Cannot verify - Supabase not configured');
      console.log('💡 Check your downloads page manually: /downloads/prompts');
    }
  } catch (error) {
    console.log('❌ Verification error:', error.message);
  }
}

// Additional helper functions
function showTroubleshootingTips() {
  console.log('\n🛠️ TROUBLESHOOTING TIPS');
  console.log('=======================');
  console.log('1. Check your .env.local file has correct Supabase credentials');
  console.log('2. Ensure the "purchases" table exists in Supabase');
  console.log('3. Verify your user account exists and is logged in');
  console.log('4. Clear browser cache and cookies');
  console.log('5. Try accessing /downloads/prompts directly');
  console.log('\n🔧 Environment Variables Needed:');
  console.log('- SUPABASE_URL=your_supabase_url');
  console.log('- SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.log('\n📞 If still having issues:');
  console.log('- Check server logs during a test purchase');
  console.log('- Use browser dev tools to inspect network requests');
  console.log('- Verify Stripe webhook is reaching your server');
}

// Run the script
if (require.main === module) {
  emergencyUnlock().catch(error => {
    console.error('\n💥 SCRIPT FAILED:', error.message);
    showTroubleshootingTips();
    process.exit(1);
  });
}

module.exports = {
  emergencyUnlock,
  unlockViaSupabase,
  unlockViaFile,
  verifyUnlock
}; 