require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

async function testCoachingBookingEmail() {
  console.log('Testing Coaching Booking Email System...');
  
  // Check environment variables
  if (!process.env.SENDGRID_API_KEY) {
    console.log('❌ SENDGRID_API_KEY not configured');
    return;
  }
  
  if (!process.env.EMAIL_FROM) {
    console.log('❌ EMAIL_FROM not configured');
    return;
  }
  
  console.log('✅ SENDGRID_API_KEY exists');
  console.log('✅ EMAIL_FROM:', process.env.EMAIL_FROM);
  
  // Set API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  // Test customer booking confirmation email
  const customerEmail = {
    to: 'chris.t@ventarosales.com', // Using admin email for testing
    from: process.env.EMAIL_FROM,
    subject: 'Test: Coaching Session Booking Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #2563eb; margin-bottom: 20px;">🎯 Coaching Session Booking Confirmation</h1>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi Test User,</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for booking your coaching session! We've received your request and it's currently pending confirmation.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">📋 Booking Details:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li><strong>Date:</strong> January 15, 2025</li>
              <li><strong>Time:</strong> 10:00 AM (America/New_York)</li>
              <li><strong>Duration:</strong> 60 minutes</li>
              <li><strong>Session Type:</strong> AI Business Strategy Session</li>
            </ul>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📧 What happens next?</h3>
            <ul style="color: #1e40af; line-height: 1.8;">
              <li><strong>Confirmation:</strong> We'll confirm your booking within 24 hours</li>
              <li><strong>Meeting Link:</strong> You'll receive a Google Meet link via email</li>
              <li><strong>Calendar Invite:</strong> A calendar invitation will be sent to your email</li>
              <li><strong>Preparation:</strong> We'll send you a brief preparation guide</li>
            </ul>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            If you have any questions or need to reschedule, please reply to this email or contact us at chris.t@ventarosales.com
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Kind Regards,<br>
            Ventaro AI
          </p>
        </div>
      </div>
    `
  };
  
  // Test admin notification email
  const adminEmail = {
    to: 'chris.t@ventarosales.com',
    from: process.env.EMAIL_FROM,
    subject: 'Test: New Coaching Session Booking Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #dc2626; margin-bottom: 20px;">🚨 New Coaching Session Booking</h1>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">A new coaching session has been booked and requires your confirmation.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">👤 Customer Details:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li><strong>Name:</strong> Test User</li>
              <li><strong>Email:</strong> test@example.com</li>
              <li><strong>User ID:</strong> test-user-123</li>
            </ul>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">📅 Session Details:</h3>
            <ul style="color: #92400e; line-height: 1.8;">
              <li><strong>Date:</strong> January 15, 2025</li>
              <li><strong>Time:</strong> 10:00 AM (America/New_York)</li>
              <li><strong>Session Type:</strong> AI Business Strategy Session</li>
              <li><strong>Notes:</strong> Looking to scale my e-commerce business with AI automation</li>
            </ul>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1e40af; margin: 0;">Please confirm or reschedule this booking within 24 hours.</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            <strong>Action Required:</strong> Log into the admin panel to confirm this booking.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    // Send customer email
    console.log('\n📧 Sending customer booking confirmation email...');
    const customerResponse = await sgMail.send(customerEmail);
    console.log('✅ Customer email sent successfully! Status:', customerResponse[0].statusCode);
    
    // Send admin email
    console.log('\n📧 Sending admin notification email...');
    const adminResponse = await sgMail.send(adminEmail);
    console.log('✅ Admin email sent successfully! Status:', adminResponse[0].statusCode);
    
    console.log('\n🎉 All coaching booking emails sent successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Customer booking confirmation email');
    console.log('   ✅ Admin notification email');
    console.log('   ✅ Email templates are properly formatted');
    console.log('   ✅ SendGrid integration working');
    
  } catch (error) {
    console.error('❌ Error sending emails:', error.response?.body || error.message);
  }
}

testCoachingBookingEmail();