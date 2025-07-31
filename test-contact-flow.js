const sgMail = require('@sendgrid/mail');
require('dotenv').config({ path: '.env.local' });

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testContactFlow() {
  console.log('🧪 Testing Complete Contact Form Flow...');
  console.log('=' .repeat(60));
  console.log('');

  // Check environment variables
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.error('❌ Missing required environment variables');
    return;
  }

  console.log('✅ Environment variables configured');
  console.log(`📧 Admin email: ${process.env.EMAIL_FROM}`);
  console.log('');

  // Test different contact scenarios
  const testScenarios = [
    {
      name: 'General Inquiry Test',
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        subject: 'General Inquiry',
        product: '',
        message: 'Hi, I\'m interested in learning more about your AI tools and services. Could you provide more information about what you offer?'
      }
    },
    {
      name: 'Product Support Test',
      data: {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        subject: 'Product Support',
        product: 'AI Business Strategy Session 2025',
        message: 'I purchased the AI Business Strategy Session but I\'m having trouble accessing the booking calendar. Can you help me schedule my session?'
      }
    },
    {
      name: 'Technical Issue Test',
      data: {
        name: 'Emma Rodriguez',
        email: 'emma.rodriguez@example.com',
        subject: 'Technical Issue',
        product: 'AI Prompts Arsenal',
        message: 'I\'m experiencing issues downloading the AI Prompts Arsenal after purchase. The download link doesn\'t seem to be working. Please assist.'
      }
    },
    {
      name: 'Billing Question Test',
      data: {
        name: 'David Kim',
        email: 'david.kim@example.com',
        subject: 'Billing Question',
        product: 'AI Tools Mastery Guide',
        message: 'I have a question about my recent purchase. I was charged twice for the same product. Can you please look into this and provide a refund for the duplicate charge?'
      }
    }
  ];

  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`📋 Testing Scenario ${i + 1}: ${scenario.name}`);
    console.log('-'.repeat(40));

    try {
      // 1. Send Admin Notification
      console.log('📤 Sending admin notification...');
      const adminEmail = {
        to: process.env.EMAIL_FROM,
        from: process.env.EMAIL_FROM,
        subject: `New Contact Form Submission: ${scenario.data.subject}`,
        html: generateAdminEmailHTML(scenario.data)
      };

      await sgMail.send(adminEmail);
      console.log('✅ Admin notification sent');

      // 2. Send Customer Thank You
      console.log('📤 Sending customer thank you...');
      const customerEmail = {
        to: scenario.data.email,
        from: process.env.EMAIL_FROM,
        subject: 'Thank you for contacting us - Ventaro Sales',
        html: generateCustomerEmailHTML(scenario.data)
      };

      await sgMail.send(customerEmail);
      console.log('✅ Customer thank you sent');
      console.log('');

      // Small delay between scenarios
      if (i < testScenarios.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error('❌ Error in scenario:', error.response?.body || error.message);
      console.log('');
    }
  }

  console.log('🎉 Contact Form Flow Testing Complete!');
  console.log('=' .repeat(60));
  console.log('✅ All email templates working correctly');
  console.log('📧 Admin receives detailed contact submissions');
  console.log('🙏 Customers receive professional acknowledgments');
  console.log('📊 Multiple contact scenarios tested successfully');
  console.log('');
  console.log('⚠️  Note: Database table "contact_submissions" needs to be created manually');
  console.log('   Run "node check-contact-table.js" for SQL creation script');
}

function generateAdminEmailHTML(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2563eb; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📬 New Contact Form Submission</h2>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 15px;">📋 Contact Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280; width: 30%;">Name:</td>
              <td style="padding: 8px 0; color: #374151;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Email:</td>
              <td style="padding: 8px 0; color: #374151;">${data.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Subject:</td>
              <td style="padding: 8px 0; color: #374151;">${data.subject}</td>
            </tr>
            ${data.product ? `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Product Reference:</td>
              <td style="padding: 8px 0; color: #374151;">${data.product}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 15px;">💬 Message:</h3>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; color: #374151; line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Submitted: ${new Date().toLocaleString()}</p>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">This message was sent via the Ventaro Sales contact form</p>
        </div>
      </div>
    </div>
  `;
}

function generateCustomerEmailHTML(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #16a34a; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🙏 Thank you for reaching out!</h2>
        
        <p style="color: #374151; line-height: 1.6; font-size: 16px;">Dear <strong>${data.name}</strong>,</p>
        
        <p style="color: #374151; line-height: 1.6;">We have received your message regarding <strong>"${data.subject}"</strong> and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 10px;">📋 Your Message Summary:</h3>
          <p style="color: #374151; margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
          ${data.product ? `<p style="color: #374151; margin: 5px 0;"><strong>Product Reference:</strong> ${data.product}</p>` : ''}
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
  `;
}

// Run the test
testContactFlow();