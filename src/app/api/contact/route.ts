import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { bulletproofAuth } from '@/lib/auth-bulletproof';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old rate limit entries
const cleanupRateLimit = () => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Check rate limit (3 submissions per day per email)
const checkRateLimit = (email: string): { allowed: boolean; remaining: number } => {
  cleanupRateLimit();
  
  const now = Date.now();
  const resetTime = new Date().setHours(24, 0, 0, 0); // Reset at midnight
  const key = `contact_${email}`;
  
  const current = rateLimitStore.get(key) || { count: 0, resetTime };
  
  if (now > current.resetTime) {
    // Reset counter for new day
    current.count = 0;
    current.resetTime = resetTime;
  }
  
  const allowed = current.count < 3;
  const remaining = Math.max(0, 3 - current.count);
  
  if (allowed) {
    current.count++;
    rateLimitStore.set(key, current);
  }
  
  return { allowed, remaining };
};

export async function POST(request: NextRequest) {
  console.log('📧 CONTACT FORM: Processing submission...');
  
  try {
    const { name, email, subject, message } = await request.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(email);
    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'You have reached the maximum number of submissions for today (3). Please try again tomorrow.',
          remaining: 0
        },
        { status: 429 }
      );
    }

    console.log(`✅ CONTACT FORM: Rate limit check passed. Remaining: ${remaining}`);

    // Send email to admin
    const adminEmailResult = await sendEmail({
      to: 'chris.t@ventarosales.com',
      subject: `🔔 New Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔔 New Contact Form Submission</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Contact Details:</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #007bff;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Submitted:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
            
            <h3 style="color: #333; margin-top: 30px;">Message:</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #1976d2;">
                <strong>📊 Rate Limit Info:</strong> This email has ${remaining} contact submissions remaining today.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}?subject=Re: ${subject}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reply to ${name}
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}
Submitted: ${new Date().toLocaleString()}

Message:
${message}

Reply to: ${email}`
    });

    // Send auto-reply to customer
    const customerEmailResult = await sendEmail({
      to: email,
      subject: '✅ Thank you for contacting Ventaro AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Thank you for contacting us</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You! 🙏</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">We've received your message</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p>Thank you for reaching out to Ventaro AI! We've successfully received your message about "<strong>${subject}</strong>" and our team will review it shortly.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">📋 Your Submission Summary:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Subject:</strong> ${subject}</li>
                <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Reference ID:</strong> ${Date.now()}</li>
              </ul>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2d5a2d;">⏰ What Happens Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #2d5a2d;">
                <li>Our team will review your message within 24 hours</li>
                <li>You'll receive a personalized response via email</li>
                <li>For urgent matters, we'll prioritize your request</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>💡 While You Wait:</strong> Check out our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products" style="color: #856404;">AI Tools and Resources</a> to get started right away!
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
              Need immediate assistance? Contact us at <a href="mailto:chris.t@ventarosales.com" style="color: #007bff;">chris.t@ventarosales.com</a>
              <br>
              <span style="font-size: 12px;">Ventaro AI - Pioneering the future of digital products with AI</span>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Thank you for contacting Ventaro AI!

Hi ${name},

We've received your message about "${subject}" and our team will review it within 24 hours.

Your Reference ID: ${Date.now()}
Submitted: ${new Date().toLocaleString()}

What happens next:
- Our team will review your message within 24 hours
- You'll receive a personalized response via email
- For urgent matters, we'll prioritize your request

While you wait, check out our AI Tools and Resources: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products

Best regards,
The Ventaro AI Team

Need immediate assistance? Contact: chris.t@ventarosales.com`
    });

    console.log(`📧 CONTACT FORM: Admin email ${adminEmailResult.success ? 'sent' : 'failed'}`);
    console.log(`📧 CONTACT FORM: Customer email ${customerEmailResult.success ? 'sent' : 'failed'}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      remaining: remaining - 1,
      emailsSent: {
        admin: adminEmailResult.success,
        customer: customerEmailResult.success
      }
    });

  } catch (error: any) {
    console.error('❌ CONTACT FORM: Error:', error);
    
    return NextResponse.json({
      error: 'Failed to send message. Please try again.',
      success: false
    }, { status: 500 });
  }
}