// Load environment variables
require('dotenv').config({ path: '.env.local' });
const { sendEmail } = require('./src/lib/sendgrid.ts');

async function testSendGridDirect() {
  console.log('🧪 Testing SendGrid Direct Email Sending...');
  console.log('Environment variables:');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');
  
  try {
    // Test 1: Send admin notification
    console.log('\n📧 Testing admin notification email...');
    const adminResult = await sendEmail({
      to: 'chris.t@ventarosales.com',
      subject: 'Test Admin Notification - Web Creation Form',
      html: `
        <h2>Test Admin Notification</h2>
        <p><strong>Name:</strong> Test User</p>
        <p><strong>Email:</strong> test@example.com</p>
        <p><strong>Message:</strong> Testing web creation form email functionality</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      `
    });
    
    console.log('Admin email result:', adminResult);
    
    // Test 2: Send client confirmation
    console.log('\n📧 Testing client confirmation email...');
    const clientResult = await sendEmail({
      to: 'test@example.com',
      subject: 'Thank You for Your Web Creation Request',
      html: `
        <h2>Thank You for Your Request!</h2>
        <p>Dear Test User,</p>
        <p>We have received your web creation request and will get back to you within 24 hours.</p>
        <p>Best regards,<br>Ventaro Sales Team</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      `
    });
    
    console.log('Client email result:', clientResult);
    
    if (adminResult.success && clientResult.success) {
      console.log('\n✅ Both emails sent successfully!');
    } else {
      console.log('\n❌ Some emails failed to send');
      if (!adminResult.success) console.log('Admin email failed:', adminResult.error);
      if (!clientResult.success) console.log('Client email failed:', clientResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testSendGridDirect();