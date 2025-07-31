const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testContactFormEmails() {
  console.log('🧪 Testing Contact Form Email System...');
  console.log('=' .repeat(50));

  // Check environment variables
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY not found in environment variables');
    return;
  }

  if (!process.env.EMAIL_FROM) {
    console.error('❌ EMAIL_FROM not found in environment variables');
    return;
  }

  console.log('✅ Environment variables configured');
  console.log(`📧 Sending from: ${process.env.EMAIL_FROM}`);
  console.log('');

  // Test data
  const testData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Product Support',
    product: 'AI Business Strategy Session 2025',
    message: 'I have a question about the coaching session booking process. Can you help me understand how to schedule my session after purchase?'
  };

  try {
    // 1. Test Admin Notification Email
    console.log('📤 Sending admin notification email...');
    const adminEmail = {
      to: 'chris.t@ventarosales.com',
      from: process.env.EMAIL_FROM,
      subject: `New Contact Form Submission: ${testData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📬 New Contact Form Submission</h2>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #374151; margin-bottom: 15px;">📋 Contact Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280; width: 30%;">Name:</td>
                  <td style="padding: 8px 0; color: #374151;">${testData.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Email:</td>
                  <td style="padding: 8px 0; color: #374151;">${testData.email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Subject:</td>
                  <td style="padding: 8px 0; color: #374151;">${testData.subject}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Product Reference:</td>
                  <td style="padding: 8px 0; color: #374151;">${testData.product}</td>
                </tr>
              </table>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #374151; margin-bottom: 15px;">💬 Message:</h3>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
                <p style="margin: 0; color: #374151; line-height: 1.6;">${testData.message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">This message was sent via the Ventaro Sales contact form</p>
            </div>
          </div>
        </div>
      `
    };

    await sgMail.send(adminEmail);
    console.log('✅ Admin notification email sent successfully');

    // 2. Test Customer Thank You Email
    console.log('📤 Sending customer thank you email...');
    const customerEmail = {
      to: testData.email,
      from: process.env.EMAIL_FROM,
      subject: 'Thank you for contacting us - Ventaro Sales',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #16a34a; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🙏 Thank you for reaching out!</h2>
            
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">Dear <strong>${testData.name}</strong>,</p>
            
            <p style="color: #374151; line-height: 1.6;">We have received your message regarding <strong>"${testData.subject}"</strong> and will get back to you as soon as possible.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 10px;">📋 Your Message Summary:</h3>
              <p style="color: #374151; margin: 5px 0;"><strong>Subject:</strong> ${testData.subject}</p>
              <p style="color: #374151; margin: 5px 0;"><strong>Product Reference:</strong> ${testData.product}</p>
              <p style="color: #374151; margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">Our team typically responds within <strong>24 hours during business days</strong>. We appreciate your interest in our AI tools and services.</p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://ventarosales.com" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit Our Website</a>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">Kind Regards,</p>
            <p style="color: #374151; line-height: 1.6; font-weight: bold;">Ventaro AI</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">📧 chris.t@ventarosales.com | 🌐 ventarosales.com</p>
            </div>
          </div>
        </div>
      `
    };

    await sgMail.send(customerEmail);
    console.log('✅ Customer thank you email sent successfully');

    console.log('');
    console.log('🎉 All contact form emails sent successfully!');
    console.log('=' .repeat(50));
    console.log('✅ Contact form email system is working correctly');
    console.log('📧 Admin receives detailed contact form submissions');
    console.log('🙏 Customers receive professional thank you confirmations');
    
  } catch (error) {
    console.error('❌ Error sending emails:', error.response?.body || error.message);
  }
}

// Run the test
testContactFormEmails();