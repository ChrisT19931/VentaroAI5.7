import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: NextRequest) {
  console.log('🔐 Starting user registration...');
  
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password) {
      console.error('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.error('❌ Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('✅ Input validation passed for:', email);

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      console.error('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists with this email address' },
        { status: 409 }
      );
    }

    console.log('✅ User does not exist, proceeding with registration');

    // Create new user
    const newUser = await db.createUser({
      email,
      password,
      name: name || email.split('@')[0],
      user_role: 'user'
    });

    if (!newUser) {
      console.error('❌ Failed to create user');
      return NextResponse.json(
        { error: 'Failed to create user account. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ User created successfully:', newUser.email);

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(newUser.email, newUser.name || 'User');
      console.log('✅ Welcome email sent to:', newUser.email);
    } catch (emailError) {
      console.warn('⚠️ Failed to send welcome email (non-blocking):', emailError);
    }

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now log in to your account.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        created_at: newUser.created_at
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      return NextResponse.json(
        { error: 'User already exists with this email address' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
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
      <title>Welcome to Ventaro AI</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content { 
          padding: 40px 30px; 
        }
        .content h2 {
          color: #2d3748;
          margin-top: 0;
          font-size: 24px;
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 16px 32px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 24px 0; 
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .features {
          background: #f7fafc;
          padding: 24px;
          border-radius: 8px;
          margin: 24px 0;
        }
        .features h3 {
          margin-top: 0;
          color: #2d3748;
        }
        .features ul {
          padding-left: 20px;
        }
        .features li {
          margin: 8px 0;
          color: #4a5568;
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
          color: #718096; 
          font-size: 14px; 
        }
        .social {
          margin: 16px 0;
        }
        .social a {
          color: #667eea;
          text-decoration: none;
          margin: 0 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Ventaro AI! 🚀</h1>
          <p>Your AI-Powered Digital Success Platform</p>
        </div>
        
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Welcome to the Ventaro AI community! We're thrilled to have you join thousands of entrepreneurs who are using AI to transform their businesses and accelerate their success.</p>
          
          <div class="features">
            <h3>🎯 What's Available Now:</h3>
            <ul>
              <li><strong>AI Tools Mastery Guide 2025</strong> - Master ChatGPT, Claude, Grok & Gemini</li>
              <li><strong>30 AI Prompts Arsenal</strong> - Professional money-making prompts</li>
              <li><strong>AI Web Creation Masterclass</strong> - Build AI-powered websites</li>
              <li><strong>Premium Support Package</strong> - Get expert guidance</li>
            </ul>
          </div>
          
          <p>Your account is ready! You can now log in and start exploring our premium AI resources.</p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaro.ai'}/signin" class="button">
            Access Your Account →
          </a>
          
          <p><strong>Quick Start Tips:</strong></p>
          <ul>
            <li>Browse our product catalog to see what's available</li>
            <li>Check out the AI Tools Mastery Guide for immediate value</li>
            <li>Join our community of AI entrepreneurs</li>
            <li>Reach out if you need any help getting started</li>
          </ul>
          
          <p>If you have any questions or need assistance, simply reply to this email or contact our support team.</p>
          
          <p>Welcome aboard!</p>
          <p><strong>The Ventaro AI Team</strong></p>
        </div>
        
        <div class="footer">
          <div class="social">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaro.ai'}/contact">Support</a> |
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaro.ai'}/faq">FAQ</a> |
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ventaro.ai'}/terms">Terms</a>
          </div>
          <p>© ${new Date().getFullYear()} Ventaro AI. All rights reserved.</p>
          <p>You received this email because you signed up for a Ventaro AI account.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const subject = `Welcome to Ventaro AI, ${name}! 🚀 Your Account is Ready`;
  
  return sendEmail({
    to: email,
    subject,
    html,
    from: process.env.EMAIL_FROM || 'support@ventaro.ai',
  });
}