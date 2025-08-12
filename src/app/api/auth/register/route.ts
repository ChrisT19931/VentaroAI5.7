import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create Supabase client


    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
          email_confirm: false, // Disable email verification
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/account`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // If user was created successfully, send welcome email
    if (data.user) {
      try {
        await sendWelcomeEmail(email, name || email.split('@')[0]);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the registration if email fails
      }

      return NextResponse.json({
        message: 'Registration successful! You can now log in to your account.',
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Ventaro</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Ventaro!</h1>
        <p>Your AI-Powered Digital Store</p>
      </div>
      <div class="content">
        <h2>Hello ${name}!</h2>
        <p>Thank you for joining Ventaro, your premier destination for AI-powered digital products and tools.</p>
        
        <p>With your new account, you can:</p>
        <ul>
          <li>Access cutting-edge AI tools and guides</li>
          <li>Download premium digital products</li>
          <li>Get exclusive AI prompts and strategies</li>
          <li>Transform your business with AI</li>
        </ul>
        
        <p>Ready to explore our AI-powered products?</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}" class="button">Browse Products</a>
        
        <p>If you have any questions, feel free to reach out to our support team.</p>
        
        <p>Kind Regards,<br>Ventaro AI</p>
      </div>
      <div class="footer">
        <p>© 2024 Ventaro. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to Ventaro!
    
    Hello ${name}!
    
    Thank you for joining Ventaro, your premier destination for AI-powered digital products and tools.
    
    With your new account, you can:
    - Access cutting-edge AI tools and guides
    - Download premium digital products
    - Get exclusive AI prompts and strategies
    - Transform your business with AI
    
    Visit ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'} to browse our products.
    
    Kind Regards,
    Ventaro AI
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Ventaro - Your AI-Powered Digital Store',
    html,
    text,
  });
}