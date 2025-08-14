import { NextRequest, NextResponse } from 'next/server';
import { bulletproofAuth } from '@/lib/auth-bulletproof';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: NextRequest) {
  console.log('🚀 BULLETPROOF REGISTER: Starting user registration...');
  
  try {
    const { email, password, name } = await request.json();

    // BULLETPROOF INPUT VALIDATION
    if (!email || !password) {
      console.error('❌ BULLETPROOF REGISTER: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.error('❌ BULLETPROOF REGISTER: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ BULLETPROOF REGISTER: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('✅ BULLETPROOF REGISTER: Input validation passed for:', email);

    // Check if user already exists
    const existingUser = await bulletproofAuth.findUser(email);
    if (existingUser) {
      console.error('❌ BULLETPROOF REGISTER: User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists with this email address' },
        { status: 409 }
      );
    }

    console.log('✅ BULLETPROOF REGISTER: User does not exist, proceeding with registration');

    // Create new user with bulletproof system
    const newUser = await bulletproofAuth.createUser({
      email,
      password,
      name: name || email.split('@')[0],
      user_role: 'user'
    });

    if (!newUser) {
      console.error('❌ BULLETPROOF REGISTER: Failed to create user');
      return NextResponse.json(
        { error: 'Failed to create user account. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ BULLETPROOF REGISTER: User created successfully:', newUser.email);

    // BULLETPROOF EMAIL SENDING (non-blocking)
    try {
      console.log('📧 BULLETPROOF REGISTER: Sending welcome email...');
      
      const emailResult = await sendEmail({
        to: newUser.email,
        subject: '🎉 Welcome to Ventaro AI - Your Account is Ready!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Ventaro AI</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Ventaro AI! 🎉</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your AI-powered journey starts now</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${newUser.name}! 👋</h2>
              
              <p>Your Ventaro AI account has been successfully created! You now have access to cutting-edge AI tools and resources.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #495057;">🚀 What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li><strong>Explore Products:</strong> Browse our AI Tools Mastery Guide, AI Prompts Arsenal, and more</li>
                  <li><strong>Access Your Dashboard:</strong> View your purchases and downloads in your account</li>
                  <li><strong>Get Support:</strong> Book a strategy session or contact our team</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/my-account" 
                   style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Access Your Account →
                </a>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #1976d2;">
                  <strong>💡 Pro Tip:</strong> Your account is ready to use immediately - no email verification needed!
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
                Need help? Contact us at <a href="mailto:support@ventaroai.com" style="color: #007bff;">support@ventaroai.com</a>
                <br>
                <span style="font-size: 12px;">Ventaro AI - Pioneering the future of digital products with AI</span>
              </p>
            </div>
          </body>
          </html>
        `,
        text: `Welcome to Ventaro AI!

Hi ${newUser.name}!

Your account has been successfully created. You can now access all our AI tools and resources.

Visit your account: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/my-account

Need help? Contact us at support@ventaroai.com

Best regards,
The Ventaro AI Team`
      });

      if (emailResult.success) {
        console.log('✅ BULLETPROOF REGISTER: Welcome email sent successfully');
      } else {
        console.warn('⚠️ BULLETPROOF REGISTER: Welcome email failed (non-blocking):', emailResult.error);
      }
    } catch (emailError) {
      console.warn('⚠️ BULLETPROOF REGISTER: Email sending error (non-blocking):', emailError);
      // Don't fail registration if email fails
    }

    console.log('🎉 BULLETPROOF REGISTER: Registration completed successfully for:', newUser.email);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        created_at: newUser.created_at
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ BULLETPROOF REGISTER: Registration error:', error);
    
    return NextResponse.json({
      error: error.message || 'Registration failed. Please try again.',
      success: false
    }, { status: 500 });
  }
}