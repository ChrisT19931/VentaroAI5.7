#!/usr/bin/env node

/**
 * Setup Admin User Script
 * 
 * This script creates an admin user in the Supabase database.
 * Run this after setting up your Supabase project and database tables.
 * 
 * Usage: node scripts/setup-admin.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('🚀 Setting up admin user...');
    
    // Check if admin user already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ventaroai.com';
    const { data: existingAdmin, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .eq('is_admin', true)
      .single();
    
    if (existingAdmin && !checkError) {
      console.log('✅ Admin user already exists!');
      console.log(`Admin ID: ${existingAdmin.id}`);
      console.log(`Email: ${existingAdmin.email}`);
      return;
    }
    
    // Update user to admin if they exist
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('email', adminEmail)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Error updating user to admin:', updateError.message);
      console.log('\n📝 Manual steps:');
      console.log(`1. Sign up at your website with ${adminEmail}`);
      console.log('2. Run this script again, or');
      console.log('3. Manually run this SQL in Supabase:');
      console.log(`   UPDATE profiles SET is_admin = true WHERE email = '${adminEmail}';`);
      return;
    }
    
    console.log('✅ Admin user created successfully!');
    console.log(`Admin ID: ${updatedUser.id}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Admin Status: ${updatedUser.is_admin}`);
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  }
}

async function insertSampleProducts() {
  try {
    console.log('\n📦 Inserting sample products...');
    
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('✅ Products already exist!');
      return;
    }
    
    const products = [
      {
        name: 'AI Tools Mastery Guide 2025',
        description: '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
        price: 25.00,
        category: 'E-book',
        featured: true,
        is_active: true
      },
      {
        name: 'AI Prompts Arsenal 2025',
        description: '30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
        price: 10.00,
        category: 'AI Prompts',
        featured: true,
        is_active: true
      },
      {
        name: 'AI Business Strategy Session 2025',
        description: '60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies to build profitable AI-powered businesses in 2025.',
        price: 497.00,
        category: 'Coaching',
        featured: true,
        is_active: true
      }
    ];
    
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(products)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting products:', insertError.message);
      return;
    }
    
    console.log(`✅ Inserted ${insertedProducts.length} products successfully!`);
    insertedProducts.forEach(product => {
      console.log(`   - ${product.name} ($${product.price})`);
    });
    
  } catch (error) {
    console.error('❌ Error inserting products:', error.message);
  }
}

async function main() {
  console.log('🔧 Ventaro AI Digital Store Setup');
  console.log('================================\n');
  
  await setupAdmin();
  await insertSampleProducts();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Visit http://localhost:3001');
  console.log(`3. Login with ${process.env.ADMIN_EMAIL || 'admin@ventaroai.com'}`);
  console.log('4. Access admin panel at /admin');
}

main().catch(console.error);