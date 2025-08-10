import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      subject,
      description,
      priority,
      preferredDate,
      preferredTime,
      contactMethod,
      phoneNumber,
      userEmail,
      userName,
      userId
    } = body;

    // Validate required fields
    if (!subject || !description || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #059669; margin-bottom: 20px; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            New Support Request
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Request Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 150px;">Subject:</td>
                <td style="padding: 8px 0; color: #333;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Priority:</td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${getPriorityColor(priority)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">
                    ${priority}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Contact Method:</td>
                <td style="padding: 8px 0; color: #333; text-transform: capitalize;">${contactMethod.replace('-', ' ')}</td>
              </tr>
              ${phoneNumber ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone Number:</td>
                <td style="padding: 8px 0; color: #333;">${phoneNumber}</td>
              </tr>
              ` : ''}
              ${preferredDate ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Preferred Date:</td>
                <td style="padding: 8px 0; color: #333;">${new Date(preferredDate).toLocaleDateString()}</td>
              </tr>
              ` : ''}
              ${preferredTime ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Preferred Time:</td>
                <td style="padding: 8px 0; color: #333;">${preferredTime}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Customer Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 150px;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${userName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${userEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">User ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace; font-size: 12px;">${userId}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Description</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #059669;">
              <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${description}</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This support request was submitted on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email to admin
    const msg = {
      to: 'chris.t@ventarosales.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@ventarosales.com',
      subject: `Support Request: ${subject} [${priority.toUpperCase()}]`,
      html: emailContent,
      replyTo: userEmail
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg);
    } else {
      console.log('SendGrid not configured, would send:', msg);
    }

    // Send confirmation email to user
    const confirmationMsg = {
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@ventarosales.com',
      subject: 'Support Request Received - Ventaro AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #059669; margin-bottom: 20px;">Support Request Received</h2>
            
            <p style="color: #333; line-height: 1.6;">Hi ${userName},</p>
            
            <p style="color: #333; line-height: 1.6;">
              Thank you for contacting our support team. We have received your request and will get back to you within 24 hours.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Request Summary:</h3>
              <p style="margin: 5px 0; color: #555;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Priority:</strong> ${priority}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #333; line-height: 1.6;">
              If you have any urgent questions, you can reply to this email or contact us directly at chris.t@ventarosales.com.
            </p>
            
            <p style="color: #333; line-height: 1.6;">
              Best regards,<br>
              The Ventaro AI Support Team
            </p>
          </div>
        </div>
      `
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(confirmationMsg);
    }

    return NextResponse.json(
      { message: 'Support request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing support request:', error);
    return NextResponse.json(
      { error: 'Failed to process support request' },
      { status: 500 }
    );
  }
}

function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return '#dc2626';
    case 'high':
      return '#ea580c';
    case 'medium':
      return '#ca8a04';
    case 'low':
      return '#059669';
    default:
      return '#6b7280';
  }
}