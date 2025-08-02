// Load environment variables
require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

async function testSendGridDetailed() {
  console.log('🧪 Testing SendGrid with detailed error logging...');
  
  // Check environment variables
  console.log('Environment variables:');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
  
  if (!process.env.SENDGRID_API_KEY) {
    console.log('❌ SENDGRID_API_KEY not set');
    return;
  }
  
  // Set API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const testEmail = {
    to: 'chris.t@ventarosales.com',
    from: process.env.EMAIL_FROM || 'chris.t@ventarosales.com',
    subject: 'Test Email from DigitalStore',
    text: 'This is a test email to verify SendGrid configuration.',
    html: '<p>This is a test email to verify SendGrid configuration.</p>'
  };
  
  console.log('📧 Sending test email with config:', {
    to: testEmail.to,
    from: testEmail.from,
    subject: testEmail.subject
  });
  
  try {
    const response = await sgMail.send(testEmail);
    console.log('✅ Email sent successfully!');
    console.log('Response:', response[0].statusCode, response[0].statusMessage);
  } catch (error) {
    console.log('❌ Email failed with detailed error:');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.response && error.response.body) {
      console.log('Response body:', JSON.stringify(error.response.body, null, 2));
    }
    
    if (error.response && error.response.body && error.response.body.errors) {
      console.log('Specific errors:');
      error.response.body.errors.forEach((err, index) => {
        console.log(`  ${index + 1}. ${err.message} (${err.field})`);
      });
    }
  }
}

testSendGridDetailed().catch(console.error);