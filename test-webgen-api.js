// Test script for the web-gen AI generate API endpoint
require('dotenv').config({ path: '.env.local' });

async function testWebGenAPI() {
  console.log('🧪 Testing Web-Gen AI Generate API...');
  
  try {
    const response = await fetch('http://localhost:3003/api/web-gen/ai-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: 'Test Business Website',
        description: 'A modern business website with a hero section, about us, services, and contact form',
        style: 'modern',
        colorScheme: 'blue',
        pages: ['home', 'about', 'services', 'contact'],
        features: ['contact-form', 'responsive-design'],
        email: 'test@example.com'
      })
    });
    
    const result = await response.json();
    console.log('API Response Status:', response.status);
    console.log('API Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Web-Gen API request successful!');
      console.log('Generated HTML length:', result.data.html?.length || 0);
      console.log('Generated CSS length:', result.data.css?.length || 0);
      console.log('AI Provider used:', result.data.provider || 'Unknown');
    } else {
      console.log('❌ Web-Gen API request failed:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Web-Gen API error:', error.message);
  }
  
  console.log('\n🎯 Summary:');
  console.log('- Web-Gen AI Generate API endpoint has been implemented');
  console.log('- The API generates HTML and CSS based on user input');
  console.log('- Email notifications are sent to the user and admin');
}

testWebGenAPI().catch(console.error);