import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      return NextResponse.json(
        { error: 'Failed to process subscription' },
        { status: 500 }
      );
    }

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    // Store newsletter subscription in database
    const { error: insertError } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        subscribed_at: new Date().toISOString(),
        is_active: true,
      });

    if (insertError) {
      console.error('Error storing newsletter subscription:', insertError);
      return NextResponse.json(
        { error: 'Failed to process subscription' },
        { status: 500 }
      );
    }

    // Send welcome email to subscriber
    try {
      await sendEmail({
        to: email,
        from: 'noreply@ventarosales.com',
        subject: 'Welcome to Ventaro AI Newsletter! 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🚀 Welcome to Ventaro AI!</h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi there,</p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for subscribing to our newsletter! You're now part of an exclusive community focused on mastering AI tools and making money online with AI in 2025.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">What to expect:</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>🎯 Latest AI tools and strategies</li>
                  <li>💡 Exclusive AI prompts and templates</li>
                  <li>📈 Money-making opportunities with AI</li>
                  <li>🔥 Early access to new products and offers</li>
                  <li>📚 Educational content and tutorials</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                While you're here, check out our current AI-powered digital products:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaroai.com'}/products" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Explore Our Products
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                Best regards,<br>
                <strong>The Ventaro AI Team</strong>
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                You received this email because you subscribed to our newsletter. 
                You can unsubscribe at any time by replying to this email.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    // Send notification to admin
    try {
      await sendEmail({
        to: 'chris.t@ventarosales.com',
        from: 'noreply@ventarosales.com',
        subject: 'New Newsletter Subscription',
        html: `
          <h2>New Newsletter Subscription</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
        `,
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the subscription if admin email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process newsletter subscription' },
      { status: 500 }
    );
  }
}