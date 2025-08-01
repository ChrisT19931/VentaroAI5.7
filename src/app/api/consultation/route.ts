import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: Request) {
  try {
    const {
      fullName,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      currentWebsite,
      projectVision
    } = await request.json();

    // Validate required fields
    if (!fullName || !email || !phone || !projectType || !budget || !timeline || !projectVision) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Send detailed consultation email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; text-align: center;">🚀 New Elite Consultation Request</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Client Information</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Full Name:</td><td style="padding: 8px 0;">${fullName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #667eea;">${phone}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Company:</td><td style="padding: 8px 0;">${company || 'Not specified'}</td></tr>
          </table>
          
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Details</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Project Type:</td><td style="padding: 8px 0;">${projectType}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Budget Range:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold;">${budget}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Timeline:</td><td style="padding: 8px 0;">${timeline}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Current Website:</td><td style="padding: 8px 0;">${currentWebsite ? `<a href="${currentWebsite}" style="color: #667eea;">${currentWebsite}</a>` : 'None specified'}</td></tr>
          </table>
          
          <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Vision</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="margin: 0; line-height: 1.6; color: #333;">${projectVision.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 16px;">💼 <strong>Action Required:</strong> Follow up within 24 hours for optimal conversion</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This consultation request was submitted via Ventaro Digital Store</p>
        </div>
      </div>
    `;

    // Send confirmation email to client
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; text-align: center;">🎉 Consultation Request Received!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Hi ${fullName},</h2>
          
          <p style="color: #555; line-height: 1.6;">Thank you for your interest in our elite custom website creation services! We've received your consultation request and are excited to help transform your vision into reality.</p>
          
          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📋 What Happens Next?</h3>
            <ul style="color: #555; line-height: 1.6;">
              <li><strong>Within 24 hours:</strong> Our team will review your project details</li>
              <li><strong>Within 48 hours:</strong> You'll receive a personalized proposal</li>
              <li><strong>Within 72 hours:</strong> We'll schedule your free consultation call</li>
            </ul>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📝 Your Submission Summary:</h3>
            <p style="color: #555; margin: 5px 0;"><strong>Project Type:</strong> ${projectType}</p>
            <p style="color: #555; margin: 5px 0;"><strong>Budget Range:</strong> ${budget}</p>
            <p style="color: #555; margin: 5px 0;"><strong>Timeline:</strong> ${timeline}</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">In the meantime, feel free to explore our portfolio and read client testimonials on our website. If you have any urgent questions, don't hesitate to reach out!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:chris.t@ventarosales.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Contact Us Directly</a>
          </div>
          
          <p style="color: #555; line-height: 1.6;">Kind Regards,<br><strong>Ventaro AI</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>© 2025 Ventaro Digital Store. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send emails
    await Promise.all([
      sendEmail({
        to: 'chris.t@ventarosales.com',
        subject: `🚀 New Elite Consultation Request from ${fullName} - ${budget}`,
        html: adminEmailHtml,
      }),
      sendEmail({
        to: email,
        subject: '🎉 Your Elite Website Consultation Request - Next Steps Inside',
        html: clientEmailHtml,
      })
    ]);

    // Store consultation request in database
    await supabase.from('consultation_requests').insert({
      full_name: fullName,
      email,
      phone,
      company,
      project_type: projectType,
      budget,
      timeline,
      current_website: currentWebsite,
      project_vision: projectVision,
      created_at: new Date().toISOString(),
      status: 'pending'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Consultation request submitted successfully! Check your email for confirmation.' 
    });
  } catch (error) {
    console.error('Consultation form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation request. Please try again.' },
      { status: 500 }
    );
  }
}