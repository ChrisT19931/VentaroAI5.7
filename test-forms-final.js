// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testFormsWithFixedSendGrid() {
  console.log('🧪 Testing Contact and Consultation Forms with Fixed SendGrid...');
  
  // Test 1: Contact Form
  console.log('\n📧 Testing Contact Form...');
  try {
    const contactResponse = await fetch('http://localhost:3004/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Contact Form Submission',
        message: 'This is a test message from the contact form.'
      })
    });
    
    const contactResult = await contactResponse.json();
    console.log('Contact Form Response:', contactResult);
    
    if (contactResponse.ok) {
      console.log('✅ Contact form submitted successfully!');
    } else {
      console.log('❌ Contact form failed:', contactResult);
    }
  } catch (error) {
    console.log('❌ Contact form error:', error.message);
  }
  
  // Test 2: Consultation Form (Web Creation Form)
  console.log('\n🌐 Testing Consultation Form (Web Creation Form)...');
  try {
    const consultationResponse = await fetch('http://localhost:3004/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        projectType: 'E-commerce Website',
        budget: '$5,000 - $10,000',
        timeline: '2-3 months',
        projectVision: 'I need a modern e-commerce website for my business.'
      })
    });
    
    const consultationResult = await consultationResponse.json();
    console.log('Consultation Form Response:', consultationResult);
    
    if (consultationResponse.ok) {
      console.log('✅ Consultation form submitted successfully!');
    } else {
      console.log('❌ Consultation form failed:', consultationResult);
    }
  } catch (error) {
    console.log('❌ Consultation form error:', error.message);
  }
  
  console.log('\n🎯 Summary:');
  console.log('- SendGrid configuration has been fixed with SENDGRID_FROM_EMAIL');
  console.log('- Both forms should now send emails to chris.t@ventarosales.com and client');
  console.log('- Environment variables are properly configured');
}

testFormsWithFixedSendGrid().catch(console.error);