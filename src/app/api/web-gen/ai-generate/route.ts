import { NextResponse } from 'next/server';
import { aiService, WebsiteGenerationRequest } from '@/lib/ai-service';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: Request) {
  try {
    // Parse request body
    const requestData = await request.json();
    const { projectName, description, style, colorScheme, pages, features, email } = requestData;

    // Validate required fields
    if (!projectName || !description || !style || !colorScheme) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Prepare generation request
    const generationRequest: WebsiteGenerationRequest = {
      projectName,
      description,
      style: style as 'modern' | 'classic' | 'minimal' | 'creative',
      colorScheme,
      pages,
      features
    };

    // Generate website using AI service
    console.log('Generating website with AI service...');
    const generationResult = await aiService.generateWebsite(generationRequest);

    // If email is provided, send confirmation
    if (email) {
      await sendConfirmationEmail(email, projectName, generationResult);
    }

    // Return the generated website
    return NextResponse.json({
      success: true,
      data: generationResult,
      message: email ? 'Website generated successfully. Check your email for confirmation.' : 'Website generated successfully.'
    });
  } catch (error) {
    console.error('Web generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate website. Please try again.' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(email: string, projectName: string, generationResult: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; text-align: center;">🚀 Your AI Website Has Been Generated!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Details</h2>
        <p style="color: #555; line-height: 1.6;">Dear User,</p>
        
        <p style="color: #555; line-height: 1.6;">
          Your AI-powered website for <strong>${projectName}</strong> has been successfully generated! 
          You can now access and customize your website through our visual editor.
        </p>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">📋 Generation Summary:</h3>
          <ul style="color: #374151; line-height: 1.8;">
            <li><strong>AI Provider:</strong> ${generationResult.provider || 'Internal'}</li>
            <li><strong>HTML Size:</strong> ${generationResult.html?.length || 0} characters</li>
            <li><strong>CSS Size:</strong> ${generationResult.css?.length || 0} characters</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/web-gen/editor" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Open Website Editor
          </a>
        </div>
        
        <p style="color: #555; line-height: 1.6;">
          If you have any questions or need assistance with your website, please don't hesitate to contact our support team.
        </p>
        
        <p style="color: #555; line-height: 1.6;">
          Kind Regards,<br>
          <strong>Ventaro AI</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Ventaro Digital Store. All rights reserved.</p>
      </div>
    </div>
  `;

  const text = `
    Your AI Website Has Been Generated!
    
    Dear User,
    
    Your AI-powered website for ${projectName} has been successfully generated! You can now access and customize your website through our visual editor.
    
    Generation Summary:
    - AI Provider: ${generationResult.provider || 'Internal'}
    - HTML Size: ${generationResult.html?.length || 0} characters
    - CSS Size: ${generationResult.css?.length || 0} characters
    
    To access your website editor, visit: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/web-gen/editor
    
    If you have any questions or need assistance with your website, please don't hesitate to contact our support team.
    
    Kind Regards,
    Ventaro AI
    
    © ${new Date().getFullYear()} Ventaro Digital Store. All rights reserved.
  `;

  // Send the email
  await sendEmail({
    to: email,
    subject: `🚀 Your AI Website for ${projectName} is Ready!`,
    html,
    text,
  });

  // Send notification to admin
  await sendEmail({
    to: 'chris.t@ventarosales.com',
    subject: `New AI Website Generated: ${projectName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">New AI Website Generated</h1>
        <p>A new website has been generated using the AI Web Generator.</p>
        <p><strong>Project Name:</strong> ${projectName}</p>
        <p><strong>User Email:</strong> ${email}</p>
        <p><strong>AI Provider:</strong> ${generationResult.provider || 'Internal'}</p>
        <p><strong>Generated At:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
    text: `
      New AI Website Generated
      
      A new website has been generated using the AI Web Generator.
      
      Project Name: ${projectName}
      User Email: ${email}
      AI Provider: ${generationResult.provider || 'Internal'}
      Generated At: ${new Date().toLocaleString()}
    `,
  });
}