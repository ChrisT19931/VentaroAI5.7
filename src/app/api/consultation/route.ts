import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';

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
  const key = `consultation_${email}`;
  
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
  console.log('🏗️ CONSULTATION FORM: Processing submission...');
  
  try {
    const { name, email, company, website, budget, timeline, description, features } = await request.json();

    // Validate input
    if (!name || !email || !description) {
      return NextResponse.json(
        { error: 'Name, email, and project description are required' },
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
          error: 'You have reached the maximum number of consultation requests for today (3). Please try again tomorrow.',
          remaining: 0
        },
        { status: 429 }
      );
    }

    console.log(`✅ CONSULTATION FORM: Rate limit check passed. Remaining: ${remaining}`);

    // Send email to admin
    const adminEmailResult = await sendEmail({
      to: 'chris.t@ventarosales.com',
      subject: `🚀 New Custom Website Consultation Request from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Website Consultation Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 25px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚀 New Website Consultation Request</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Custom AI-Powered Website Build</p>
          </div>
          
          <div style="background: white; padding: 35px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">📋 Client Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%; background: #f8f9fa;">Name:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Email:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Company:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${company || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Current Website:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  ${website ? `<a href="${website}" target="_blank" style="color: #4f46e5;">${website}</a>` : 'Not specified'}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Budget Range:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                    ${budget || 'Not specified'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Timeline:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  <span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                    ${timeline || 'Not specified'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background: #f8f9fa;">Submitted:</td>
                <td style="padding: 12px;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
            
            <h3 style="color: #333; margin-top: 35px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">📝 Project Description</h3>
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 5px solid #4f46e5; margin: 15px 0;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${description}</p>
            </div>
            
            ${features ? `
              <h3 style="color: #333; margin-top: 35px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">⚡ Requested Features</h3>
              <div style="background: #f0fdf4; padding: 25px; border-radius: 10px; border-left: 5px solid #10b981; margin: 15px 0;">
                <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${features}</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 35px; padding: 20px; background: #eff6ff; border-radius: 10px; border: 1px solid #dbeafe;">
              <h4 style="margin-top: 0; color: #1e40af; font-size: 16px;">📊 Lead Information</h4>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <div>
                  <p style="margin: 0; font-size: 14px; color: #1976d2;">
                    <strong>Rate Limit:</strong> ${remaining} consultation requests remaining today
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #1976d2;">
                    <strong>Lead Score:</strong> ${budget && timeline ? 'High Priority' : 'Medium Priority'}
                  </p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 35px; padding: 25px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 10px;">
              <h3 style="color: white; margin: 0 0 15px 0;">🎯 Quick Actions</h3>
              <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="mailto:${email}?subject=Re: Custom Website Development Consultation&body=Hi ${name},%0D%0A%0D%0AThank you for your interest in our custom website development services. I'd love to discuss your project in more detail.%0D%0A%0D%0ABest regards,%0D%0AChris T" 
                   style="background: white; color: #4f46e5; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 5px;">
                  📧 Reply to ${name}
                </a>
                <a href="tel:${email}" 
                   style="background: #10b981; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 5px;">
                  📞 Schedule Call
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Custom Website Consultation Request

Client Information:
- Name: ${name}
- Email: ${email}
- Company: ${company || 'Not specified'}
- Current Website: ${website || 'Not specified'}
- Budget: ${budget || 'Not specified'}
- Timeline: ${timeline || 'Not specified'}
- Submitted: ${new Date().toLocaleString()}

Project Description:
${description}

${features ? `Requested Features:\n${features}\n\n` : ''}Rate Limit: ${remaining} consultation requests remaining today
Lead Score: ${budget && timeline ? 'High Priority' : 'Medium Priority'}

Reply to: ${email}`
    });

    // Send auto-reply to customer
    const customerEmailResult = await sendEmail({
      to: email,
      subject: '🚀 Your Custom Website Consultation Request Received!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Custom Website Consultation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Consultation Request Received!</h1>
            <p style="color: white; margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">We're excited to build your custom website</p>
          </div>
          
          <div style="background: white; padding: 35px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Thank you for your interest in our <strong>custom AI-powered website development services</strong>! 
              We've received your consultation request and our team is excited to bring your vision to life.
            </p>
            
            <div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #4f46e5;">
              <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">📋 Your Request Summary</h3>
              <ul style="margin: 15px 0; padding-left: 20px; color: #1e40af;">
                <li><strong>Project:</strong> Custom Website Development</li>
                <li><strong>Company:</strong> ${company || 'Individual Project'}</li>
                <li><strong>Budget:</strong> ${budget || 'To be discussed'}</li>
                <li><strong>Timeline:</strong> ${timeline || 'To be discussed'}</li>
                <li><strong>Reference ID:</strong> WEB-${Date.now()}</li>
                <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <div style="background: #ecfdf5; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #10b981;">
              <h3 style="margin-top: 0; color: #047857; font-size: 18px;">⏰ What Happens Next?</h3>
              <div style="color: #047857;">
                <div style="margin: 15px 0; padding: 12px; background: white; border-radius: 6px;">
                  <strong>🕐 Within 2 hours:</strong> Initial project review and feasibility assessment
                </div>
                <div style="margin: 15px 0; padding: 12px; background: white; border-radius: 6px;">
                  <strong>📞 Within 24 hours:</strong> Personal consultation call to discuss your vision
                </div>
                <div style="margin: 15px 0; padding: 12px; background: white; border-radius: 6px;">
                  <strong>📋 Within 48 hours:</strong> Detailed proposal with timeline and pricing
                </div>
                <div style="margin: 15px 0; padding: 12px; background: white; border-radius: 6px;">
                  <strong>🚀 Project kickoff:</strong> Once approved, we start building immediately
                </div>
              </div>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #f59e0b;">
              <h4 style="margin-top: 0; color: #92400e; font-size: 16px;">🎯 Why Choose Ventaro AI for Your Website?</h4>
              <ul style="margin: 10px 0; padding-left: 20px; color: #92400e;">
                <li><strong>AI-Powered Development:</strong> Cutting-edge AI tools for faster, smarter builds</li>
                <li><strong>Full Stack Expertise:</strong> Complete control over frontend and backend</li>
                <li><strong>Unlimited Customization:</strong> Change anything with simple prompts</li>
                <li><strong>No Platform Lock-in:</strong> Own your code, deploy anywhere</li>
                <li><strong>Rapid Delivery:</strong> Most projects completed in 2-4 weeks</li>
              </ul>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h4 style="margin-top: 0; color: #374151;">📚 While You Wait - Free Resources</h4>
              <p style="margin: 10px 0; color: #6b7280;">Check out our AI tools and resources to get inspired:</p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products" 
                   style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  🎯 Explore Our AI Tools
                </a>
              </div>
            </div>
            
            <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 35px 0;">
            
            <div style="text-align: center;">
              <h4 style="color: #374151; margin-bottom: 15px;">Need to discuss your project right away?</h4>
              <p style="margin: 10px 0; color: #6b7280;">
                <strong>Direct Contact:</strong> 
                <a href="mailto:chris.t@ventarosales.com" style="color: #4f46e5; text-decoration: none;">chris.t@ventarosales.com</a>
              </p>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                Ventaro AI - Building the future of web development with artificial intelligence
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Custom Website Consultation Request Received!

Hi ${name},

Thank you for your interest in our custom AI-powered website development services! We've received your consultation request and our team is excited to bring your vision to life.

Your Request Summary:
- Project: Custom Website Development
- Company: ${company || 'Individual Project'}
- Budget: ${budget || 'To be discussed'}
- Timeline: ${timeline || 'To be discussed'}
- Reference ID: WEB-${Date.now()}
- Submitted: ${new Date().toLocaleString()}

What Happens Next:
🕐 Within 2 hours: Initial project review and feasibility assessment
📞 Within 24 hours: Personal consultation call to discuss your vision
📋 Within 48 hours: Detailed proposal with timeline and pricing
🚀 Project kickoff: Once approved, we start building immediately

Why Choose Ventaro AI:
- AI-Powered Development: Cutting-edge AI tools for faster, smarter builds
- Full Stack Expertise: Complete control over frontend and backend
- Unlimited Customization: Change anything with simple prompts
- No Platform Lock-in: Own your code, deploy anywhere
- Rapid Delivery: Most projects completed in 2-4 weeks

While you wait, check out our AI tools: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products

Need immediate assistance? Contact: chris.t@ventarosales.com

Best regards,
The Ventaro AI Development Team`
    });

    console.log(`🚀 CONSULTATION FORM: Admin email ${adminEmailResult.success ? 'sent' : 'failed'}`);
    console.log(`🚀 CONSULTATION FORM: Customer email ${customerEmailResult.success ? 'sent' : 'failed'}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your consultation request! We\'ll contact you within 24 hours to discuss your project.',
      remaining: remaining - 1,
      referenceId: `WEB-${Date.now()}`,
      emailsSent: {
        admin: adminEmailResult.success,
        customer: customerEmailResult.success
      }
    });

  } catch (error: any) {
    console.error('❌ CONSULTATION FORM: Error:', error);
    
    return NextResponse.json({
      error: 'Failed to send consultation request. Please try again.',
      success: false
    }, { status: 500 });
  }
}