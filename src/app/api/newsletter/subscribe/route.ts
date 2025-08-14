import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import { bulletproofAuth } from '@/lib/auth-bulletproof';

// In-memory storage for newsletter subscriptions (in production, use database)
const newsletterSubscriptions = new Set<string>();

export async function POST(request: NextRequest) {
  console.log('📰 NEWSLETTER: Processing subscription...');
  
  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Check if already subscribed
    if (newsletterSubscriptions.has(email.toLowerCase())) {
      return NextResponse.json({
        success: false,
        message: 'Thanks for subscribing! You\'re already on our newsletter list.',
        alreadySubscribed: true
      });
    }

    // Add to subscription list
    newsletterSubscriptions.add(email.toLowerCase());

    console.log(`✅ NEWSLETTER: New subscription added for ${email}`);

    // Send welcome email to subscriber
    const welcomeEmailResult = await sendEmail({
      to: email,
      subject: '🎉 Welcome to Ventaro AI Newsletter!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Ventaro AI Newsletter</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to Ventaro AI!</h1>
            <p style="color: white; margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">You're now part of our AI community</p>
          </div>
          
          <div style="background: white; padding: 35px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hi ${name || 'AI Enthusiast'}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Thank you for subscribing to the <strong>Ventaro AI Newsletter</strong>! 
              You've just joined a community of forward-thinking individuals who are leveraging AI to transform their businesses and lives.
            </p>
            
            <div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #667eea;">
              <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">📬 What to Expect</h3>
              <ul style="margin: 15px 0; padding-left: 20px; color: #1e40af;">
                <li><strong>Weekly AI Insights:</strong> Latest trends and breakthrough technologies</li>
                <li><strong>Exclusive Tools:</strong> Early access to new AI products and features</li>
                <li><strong>Success Stories:</strong> Real case studies from our community</li>
                <li><strong>Free Resources:</strong> Prompts, templates, and guides</li>
                <li><strong>Expert Tips:</strong> Practical advice from AI specialists</li>
              </ul>
            </div>
            
            <div style="background: #ecfdf5; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #10b981;">
              <h3 style="margin-top: 0; color: #047857; font-size: 18px;">🎁 Your Welcome Gift</h3>
              <p style="color: #047857; margin-bottom: 15px;">
                As a welcome gift, here are some immediate resources to get you started:
              </p>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products" 
                   style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 5px;">
                  🚀 Explore AI Tools
                </a>
              </div>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #f59e0b;">
              <h4 style="margin-top: 0; color: #92400e; font-size: 16px;">💡 Pro Tip for New Subscribers</h4>
              <p style="margin: 0; color: #92400e;">
                Add <strong>chris.t@ventarosales.com</strong> to your contacts to ensure our emails reach your inbox and not your spam folder!
              </p>
            </div>
            
            <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 35px 0;">
            
            <div style="text-align: center;">
              <h4 style="color: #374151; margin-bottom: 15px;">Stay Connected</h4>
              <p style="margin: 10px 0; color: #6b7280;">
                Questions or feedback? Reply to this email anytime!
              </p>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                Ventaro AI - Pioneering the future of digital products with AI
                <br>
                <a href="mailto:chris.t@ventarosales.com" style="color: #667eea; text-decoration: none;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to Ventaro AI Newsletter!

Hi ${name || 'AI Enthusiast'},

Thank you for subscribing to the Ventaro AI Newsletter! You've just joined a community of forward-thinking individuals who are leveraging AI to transform their businesses and lives.

What to Expect:
- Weekly AI Insights: Latest trends and breakthrough technologies
- Exclusive Tools: Early access to new AI products and features
- Success Stories: Real case studies from our community
- Free Resources: Prompts, templates, and guides
- Expert Tips: Practical advice from AI specialists

Your Welcome Gift:
Explore our AI tools immediately: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products

Pro Tip: Add chris.t@ventarosales.com to your contacts to ensure our emails reach your inbox!

Stay Connected:
Questions or feedback? Reply to this email anytime!

Best regards,
The Ventaro AI Team

Unsubscribe: chris.t@ventarosales.com`
    });

    // Send notification to admin
    const adminEmailResult = await sendEmail({
      to: 'chris.t@ventarosales.com',
      subject: `📰 New Newsletter Subscription: ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Newsletter Subscription</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">📰 New Newsletter Subscription</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Subscriber Details:</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subscribed:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold;">Total Subscribers:</td>
                <td style="padding: 10px; color: #10b981; font-weight: bold;">${newsletterSubscriptions.size}</td>
              </tr>
            </table>
            
            <div style="margin-top: 25px; padding: 15px; background: #f0f9ff; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #1976d2;">
                <strong>📊 Newsletter Growth:</strong> You now have ${newsletterSubscriptions.size} subscribers!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Newsletter Subscription

Subscriber Details:
- Email: ${email}
- Name: ${name || 'Not provided'}
- Subscribed: ${new Date().toLocaleString()}
- Total Subscribers: ${newsletterSubscriptions.size}

Newsletter Growth: You now have ${newsletterSubscriptions.size} subscribers!`
    });

    console.log(`📰 NEWSLETTER: Welcome email ${welcomeEmailResult.success ? 'sent' : 'failed'}`);
    console.log(`📰 NEWSLETTER: Admin notification ${adminEmailResult.success ? 'sent' : 'failed'}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for a welcome message.',
      totalSubscribers: newsletterSubscriptions.size,
      emailsSent: {
        welcome: welcomeEmailResult.success,
        admin: adminEmailResult.success
      }
    });

  } catch (error: any) {
    console.error('❌ NEWSLETTER: Error:', error);
    
    return NextResponse.json({
      error: 'Failed to subscribe to newsletter. Please try again.',
      success: false
    }, { status: 500 });
  }
}