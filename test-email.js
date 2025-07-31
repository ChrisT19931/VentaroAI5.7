// Load environment variables
require('dotenv').config({ path: '.env.local' });

const sgMail = require('@sendgrid/mail');

async function testEmail() {
  try {
    console.log('Testing email functionality...');
    console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY not found in environment variables');
      return;
    }
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: 'chris.t@ventarosales.com',
      from: process.env.EMAIL_FROM || 'chris.t@ventarosales.com',
      subject: 'Test Email - Auto Email System Check',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">🧪 Email System Test</h1>
          <p>This is a test email to verify that the auto-email system is working correctly.</p>
          <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Status:</strong> ✅ Email system is functional</p>
        </div>
      `
    };
    
    const result = await sgMail.send(msg);
    console.log('✅ Test email sent successfully!');
    console.log('Response status:', result[0].statusCode);
    
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
  }
}

testEmail();