import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface InquiryData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  features: string[];
  currentWebsite: string;
  preferredContact: string;
}

export async function POST(request: NextRequest) {
  try {
    const inquiryData: InquiryData = await request.json();

    // Validate required fields
    if (!inquiryData.name || !inquiryData.email || !inquiryData.projectType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Admin email content
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Web Design Inquiry</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .section { margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea; }
          .section h3 { margin-top: 0; color: #667eea; font-size: 18px; }
          .field { margin-bottom: 15px; }
          .field strong { color: #333; display: inline-block; min-width: 120px; }
          .features { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
          .feature-tag { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #eee; }
          .urgent { background: #fff3cd; border-left-color: #ffc107; }
          .urgent h3 { color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Web Design Inquiry</h1>
            <p>A new client is interested in web design services</p>
          </div>
          
          <div class="content">
            <div class="section ${inquiryData.timeline === 'ASAP (Rush job)' ? 'urgent' : ''}">
              <h3>👤 Client Information</h3>
              <div class="field"><strong>Name:</strong> ${inquiryData.name}</div>
              <div class="field"><strong>Email:</strong> <a href="mailto:${inquiryData.email}">${inquiryData.email}</a></div>
              ${inquiryData.phone ? `<div class="field"><strong>Phone:</strong> <a href="tel:${inquiryData.phone}">${inquiryData.phone}</a></div>` : ''}
              ${inquiryData.company ? `<div class="field"><strong>Company:</strong> ${inquiryData.company}</div>` : ''}
              <div class="field"><strong>Preferred Contact:</strong> ${inquiryData.preferredContact}</div>
            </div>

            <div class="section">
              <h3>🚀 Project Details</h3>
              <div class="field"><strong>Project Type:</strong> ${inquiryData.projectType}</div>
              ${inquiryData.budget ? `<div class="field"><strong>Budget:</strong> ${inquiryData.budget}</div>` : ''}
              ${inquiryData.timeline ? `<div class="field"><strong>Timeline:</strong> ${inquiryData.timeline}</div>` : ''}
              ${inquiryData.currentWebsite ? `<div class="field"><strong>Current Website:</strong> <a href="${inquiryData.currentWebsite}" target="_blank">${inquiryData.currentWebsite}</a></div>` : ''}
            </div>

            ${inquiryData.features.length > 0 ? `
            <div class="section">
              <h3>⚙️ Desired Features</h3>
              <div class="features">
                ${inquiryData.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            ${inquiryData.description ? `
            <div class="section">
              <h3>📝 Project Description</h3>
              <p>${inquiryData.description.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}

            <div class="section">
              <h3>📅 Next Steps</h3>
              <p>• Review the client's requirements</p>
              <p>• Prepare a detailed quote and timeline</p>
              <p>• Contact the client within 24 hours</p>
              <p>• Schedule a discovery call if needed</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This inquiry was submitted through the Ventaro AI website</p>
            <p>Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Client confirmation email content
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Design Inquiry Received</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .section { margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea; }
          .section h3 { margin-top: 0; color: #667eea; font-size: 18px; }
          .highlight { background: #e8f5e8; border-left-color: #28a745; }
          .highlight h3 { color: #28a745; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #eee; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Thank You for Your Inquiry!</h1>
            <p>We've received your web design project details</p>
          </div>
          
          <div class="content">
            <div class="section highlight">
              <h3>✅ What Happens Next?</h3>
              <p><strong>Within 24 hours:</strong> Our team will review your project requirements and prepare a detailed quote</p>
              <p><strong>Custom Proposal:</strong> You'll receive a comprehensive proposal with timeline, pricing, and project scope</p>
              <p><strong>Discovery Call:</strong> We'll schedule a call to discuss your vision and answer any questions</p>
              <p><strong>Project Kickoff:</strong> Once approved, we'll begin bringing your vision to life</p>
            </div>

            <div class="section">
              <h3>📋 Your Project Summary</h3>
              <p><strong>Project Type:</strong> ${inquiryData.projectType}</p>
              ${inquiryData.budget ? `<p><strong>Budget Range:</strong> ${inquiryData.budget}</p>` : ''}
              ${inquiryData.timeline ? `<p><strong>Timeline:</strong> ${inquiryData.timeline}</p>` : ''}
              ${inquiryData.features.length > 0 ? `<p><strong>Key Features:</strong> ${inquiryData.features.join(', ')}</p>` : ''}
            </div>

            <div class="section">
              <h3>🚀 Why Choose Ventaro AI?</h3>
              <p>• <strong>AI-Powered Development:</strong> Faster delivery with cutting-edge technology</p>
              <p>• <strong>Custom Solutions:</strong> Tailored to your specific business needs</p>
              <p>• <strong>Responsive Design:</strong> Perfect on all devices and screen sizes</p>
              <p>• <strong>SEO Optimized:</strong> Built to rank well in search engines</p>
              <p>• <strong>Ongoing Support:</strong> We're here for you after launch</p>
            </div>

            <div class="section">
              <h3>📞 Need to Reach Us?</h3>
              <p>Email: <a href="mailto:chris.t@ventarosales.com">chris.t@ventarosales.com</a></p>
              <p>We typically respond within 2-4 hours during business hours</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for considering Ventaro AI for your web design project!</p>
            <p><a href="https://ventaroai.com" class="cta-button">Visit Our Website</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send emails
    const emailPromises = [];

    // Admin notification email
    if (process.env.SENDGRID_API_KEY) {
      emailPromises.push(
        sgMail.send({
          to: 'chris.t@ventarosales.com',
          from: {
            email: 'noreply@ventaroai.com',
            name: 'Ventaro AI'
          },
          subject: `🎯 New Web Design Inquiry - ${inquiryData.projectType} ${inquiryData.timeline === 'ASAP (Rush job)' ? '(URGENT)' : ''}`,
          html: adminEmailHtml
        })
      );

      // Client confirmation email
      emailPromises.push(
        sgMail.send({
          to: inquiryData.email,
          from: {
            email: 'noreply@ventaroai.com',
            name: 'Ventaro AI'
          },
          subject: '🎯 Your Web Design Inquiry - We\'ll Be In Touch Soon!',
          html: clientEmailHtml
        })
      );
    }

    // Wait for all emails to send
    if (emailPromises.length > 0) {
      await Promise.all(emailPromises);
    }

    // Log the inquiry for analytics
    console.log('📧 Web Design Inquiry Received:', {
      name: inquiryData.name,
      email: inquiryData.email,
      projectType: inquiryData.projectType,
      budget: inquiryData.budget,
      timeline: inquiryData.timeline,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Inquiry submitted successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error processing web design inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}