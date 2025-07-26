import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const { email, productName, downloadUrl } = await request.json();

    if (!email || !productName || !downloadUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Your Download is Ready!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">AI Tools Mastery Guide 2025</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: #111;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
            <h2 style="color: #fff; margin: 0 0 10px 0; font-size: 24px;">Your ${productName} is Ready!</h2>
            <p style="color: #ccc; margin: 0; font-size: 16px;">Thank you for your purchase. Click the button below to download your guide.</p>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${downloadUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px; transition: all 0.3s ease;">
              📥 Download Your Guide Now
            </a>
          </div>
          
          <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 12px; padding: 24px; margin: 30px 0;">
            <h3 style="color: #fff; margin: 0 0 16px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">📖</span>
              What's Inside Your 30-Page Guide
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #4ade80; font-size: 18px;">✓</span>
                  <span style="color: #fff; font-weight: 600; margin-left: 8px;">Complete AI Business Strategy</span>
                  <p style="color: #ccc; font-size: 14px; margin: 4px 0 0 26px;">30 pages of actionable strategies to make money online with AI in 2025</p>
                </div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #4ade80; font-size: 18px;">✓</span>
                  <span style="color: #fff; font-weight: 600; margin-left: 8px;">50+ AI Money-Making Prompts</span>
                  <p style="color: #ccc; font-size: 14px; margin: 4px 0 0 26px;">Ready-to-use prompts for content creation, business services, and more</p>
                </div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #4ade80; font-size: 18px;">✓</span>
                  <span style="color: #fff; font-weight: 600; margin-left: 8px;">AI Tools Comparison</span>
                  <p style="color: #ccc; font-size: 14px; margin: 4px 0 0 26px;">Detailed comparison of ChatGPT, Claude, Gemini, and more</p>
                </div>
              </div>
              <div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #4ade80; font-size: 18px;">✓</span>
                  <span style="color: #fff; font-weight: 600; margin-left: 8px;">Step-by-Step Tutorials</span>
                  <p style="color: #ccc; font-size: 14px; margin: 4px 0 0 26px;">From beginner to expert with detailed implementation guides</p>
                </div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #4ade80; font-size: 18px;">✓</span>
                  <span style="color: #fff; font-weight: 600; margin-left: 8px;">Real Success Stories</span>
                  <p style="color: #ccc; font-size: 14px; margin: 4px 0 0 26px;">Case studies of people making $5K-$50K+ monthly with AI</p>
                </div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #4ade80; font-size: 18px;">✓</span>
                  <span style="color: #fff; font-weight: 600; margin-left: 8px;">Future-Proof Strategies</span>
                  <p style="color: #ccc; font-size: 14px; margin: 4px 0 0 26px;">Stay ahead with emerging AI trends and opportunities</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #fff; margin: 0 0 12px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">🎯</span>
              What You'll Achieve
            </h3>
            <ul style="margin: 0; padding: 0; list-style: none;">
              <li style="color: #ccc; font-size: 14px; margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
                <span style="color: #4ade80;">•</span>
                <span>Start making money with AI within 30 days</span>
              </li>
              <li style="color: #ccc; font-size: 14px; margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
                <span style="color: #4ade80;">•</span>
                <span>Build multiple AI-powered income streams</span>
              </li>
              <li style="color: #ccc; font-size: 14px; margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
                <span style="color: #4ade80;">•</span>
                <span>Scale to $5K-$50K+ monthly revenue</span>
              </li>
              <li style="color: #ccc; font-size: 14px; margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
                <span style="color: #4ade80;">•</span>
                <span>Future-proof your income with AI</span>
              </li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 40px 0 20px 0;">
            <a href="${downloadUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px;">
              📥 Download Now
            </a>
          </div>
          
          <div style="border-top: 1px solid #333; padding-top: 20px; margin-top: 30px;">
            <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">📋 <strong>Download Information:</strong></p>
            <ul style="color: #ccc; font-size: 14px; margin: 0; padding-left: 20px;">
              <li>File format: PDF (30 pages, optimized for all devices)</li>
              <li>File size: ~5MB (quick download)</li>
              <li>Lifetime access - re-download anytime from your account</li>
              <li>Works on desktop, tablet, and mobile</li>
            </ul>
          </div>
          
          <div style="border-top: 1px solid #333; padding-top: 20px; margin-top: 20px; text-align: center;">
            <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">Need help? Contact us:</p>
            <a href="mailto:chris.t@ventarosales.com" style="color: #667eea; text-decoration: none; font-size: 14px;">chris.t@ventarosales.com</a>
          </div>
        </div>
        
        <div style="background-color: #000; padding: 20px; text-align: center; border-top: 1px solid #333;">
          <p style="color: #666; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Ventaro Digital Store. All rights reserved.</p>
          <p style="color: #666; font-size: 12px; margin: 5px 0 0 0;">This email was sent to ${email}</p>
        </div>
      </div>
    `;

    const text = `
      🎉 Your AI Tools Mastery Guide 2025 is Ready!
      
      Thank you for your purchase! Your 30-page guide to making money online with AI is now available for download.
      
      Download Link: ${downloadUrl}
      
      What's Inside:
      ✓ Complete AI Business Strategy (30 pages of actionable strategies)
      ✓ 50+ AI Money-Making Prompts (ready-to-use for content creation and business services)
      ✓ AI Tools Comparison (ChatGPT, Claude, Gemini, and more)
      ✓ Step-by-Step Tutorials (from beginner to expert)
      ✓ Real Success Stories (case studies of $5K-$50K+ monthly earners)
      ✓ Future-Proof Strategies (stay ahead with emerging AI trends)
      
      What You'll Achieve:
      • Start making money with AI within 30 days
      • Build multiple AI-powered income streams
      • Scale to $5K-$50K+ monthly revenue
      • Future-proof your income with AI
      
      Download Information:
      • File format: PDF (30 pages, optimized for all devices)
      • File size: ~5MB (quick download)
      • Lifetime access - re-download anytime from your account
      • Works on desktop, tablet, and mobile
      
      Need help? Contact us at chris.t@ventarosales.com
      
      © ${new Date().getFullYear()} Ventaro Digital Store. All rights reserved.
    `;

    // Send the email
    const result = await sendEmail({
      to: email,
      subject: '🎉 Your AI Tools Mastery Guide 2025 is Ready for Download!',
      text,
      html,
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      console.error('Failed to send email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-download-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}