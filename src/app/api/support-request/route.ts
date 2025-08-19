import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid configured for support request emails');
} else {
  console.warn('⚠️ SendGrid API key not configured - support request emails will be logged only');
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
}

function formatDateTime(date: string, time: string): string {
  if (!date) return 'Not specified';
  
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  if (time) {
    const [hours, minutes] = time.split(':');
    const timeObj = new Date();
    timeObj.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = timeObj.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${formattedDate} at ${formattedTime}`;
  }
  
  return formattedDate;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      subject,
      description,
      priority = 'medium',
      preferredDate,
      preferredTime,
      contactMethod = 'email',
      phoneNumber,
      userEmail,
      userName,
      userId
    } = body;

    // Validate required fields
    if (!subject || !description || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, description, and userEmail are required' },
        { status: 400 }
      );
    }

    const formattedDateTime = formatDateTime(preferredDate, preferredTime);
    const submissionTime = new Date().toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Enhanced admin email with all booking details
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 25px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🛠️ New Support Package Booking</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Weekly Support Package Request</p>
        </div>
        
        <div style="background-color: white; padding: 35px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #059669; padding-bottom: 10px;">👤 Client Information</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%; background: #f8f9fa;">Name:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${userName || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Email:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="mailto:${userEmail}" style="color: #059669; text-decoration: none;">${userEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">User ID:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: monospace; color: #666;">${userId || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Phone:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${phoneNumber || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Preferred Contact:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; text-transform: capitalize;">${contactMethod}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; background: #f8f9fa;">Submitted:</td>
              <td style="padding: 12px;">${submissionTime}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; margin-top: 35px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">📋 Support Request Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%; background: #f8f9fa;">Subject:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Priority:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <span style="background-color: ${getPriorityColor(priority)}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 14px; text-transform: uppercase; font-weight: bold;">
                  ${priority}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Preferred Date/Time:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <span style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold;">
                  ${formattedDateTime}
                </span>
              </td>
            </tr>
          </table>
          
          <h3 style="color: #333; margin-top: 35px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">📝 Request Description</h3>
          <div style="background: #fef3c7; padding: 25px; border-radius: 10px; border-left: 5px solid #f59e0b; margin: 15px 0;">
            <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #92400e;">${description}</p>
          </div>
          
          <div style="margin-top: 35px; padding: 20px; background: #dcfce7; border-radius: 10px; border: 1px solid #bbf7d0;">
            <h4 style="margin-top: 0; color: #166534; font-size: 16px;">⚡ Quick Actions</h4>
            <div style="margin-top: 15px;">
              <p style="margin: 5px 0; color: #166534;">
                <strong>📧 Reply to client:</strong> <a href="mailto:${userEmail}" style="color: #059669;">${userEmail}</a>
              </p>
              ${phoneNumber ? `<p style="margin: 5px 0; color: #166534;"><strong>📞 Call client:</strong> ${phoneNumber}</p>` : ''}
              <p style="margin: 5px 0; color: #166534;">
                <strong>📅 Suggested response:</strong> Acknowledge within 2 hours, schedule within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Send admin notification email
    const adminMsg = {
      to: 'chris.t@ventarosales.com',
      from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@ventarosales.com',
      subject: `🛠️ New Support Booking: ${subject} - ${priority.toUpperCase()} Priority`,
      html: adminEmailContent
    };

    let adminEmailSent = false;
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.placeholder_api_key_replace_with_real_key') {
      try {
        await sgMail.send(adminMsg);
        console.log('✅ Admin notification email sent successfully');
        adminEmailSent = true;
      } catch (error) {
        console.error('❌ Failed to send admin notification email:', error);
        console.error('Error details:', error);
      }
    } else {
      console.log('📧 SendGrid not configured - Admin email would be sent:', adminMsg.subject);
      console.log('📧 Admin email content saved to console for debugging');
      console.log('📧 To:', adminMsg.to);
      console.log('📧 Subject:', adminMsg.subject);
    }

    // Enhanced client confirmation email
    const clientConfirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 25px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✅ Support Request Received</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">We'll be in touch soon!</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p style="color: #333; line-height: 1.6; font-size: 16px;">Hi ${userName || 'there'},</p>
          
          <p style="color: #333; line-height: 1.6;">
            Thank you for submitting your support request! We've received your booking and our team will review it shortly.
          </p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; border-left: 5px solid #10b981; margin: 25px 0;">
            <h3 style="color: #166534; margin-top: 0; font-size: 18px;">📋 Your Request Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #166534; width: 140px;">Subject:</td>
                <td style="padding: 8px 0; color: #333;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #166534;">Priority:</td>
                <td style="padding: 8px 0; color: #333;">
                  <span style="background-color: ${getPriorityColor(priority)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase; font-weight: bold;">
                    ${priority}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #166534;">Preferred Time:</td>
                <td style="padding: 8px 0; color: #333;">${formattedDateTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #166534;">Submitted:</td>
                <td style="padding: 8px 0; color: #333;">${submissionTime}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; border-left: 5px solid #3b82f6; margin: 25px 0;">
            <h4 style="margin-top: 0; color: #1e40af; font-size: 16px;">⏰ What Happens Next?</h4>
            <ul style="margin: 10px 0; padding-left: 20px; color: #1e40af;">
              <li style="margin-bottom: 8px;">We'll acknowledge your request within 2 hours during business hours</li>
              <li style="margin-bottom: 8px;">Our team will review your requirements and preferred timing</li>
              <li style="margin-bottom: 8px;">We'll contact you within 24 hours to confirm the appointment</li>
              <li style="margin-bottom: 8px;">You'll receive a calendar invite with meeting details</li>
            </ul>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; border-left: 5px solid #f59e0b; margin: 25px 0;">
            <h4 style="margin-top: 0; color: #92400e; font-size: 16px;">📞 Need Immediate Help?</h4>
            <p style="margin: 10px 0; color: #92400e; line-height: 1.6;">
              If you have an urgent issue that can't wait, you can reach us directly at:
            </p>
            <p style="margin: 10px 0; color: #92400e;">
              <strong>Email:</strong> <a href="mailto:chris.t@ventarosales.com" style="color: #059669; text-decoration: none;">chris.t@ventarosales.com</a>
            </p>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin-top: 30px;">
            We're excited to help you with your project and look forward to our upcoming session!
          </p>
          
          <p style="color: #333; line-height: 1.6;">
            Best regards,<br>
            <strong>Chris & The Ventaro AI Support Team</strong>
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Ventaro AI. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Weekly Support Package - Premium Support Service</p>
          </div>
        </div>
      </div>
    `;

    // Send client confirmation email
    const clientMsg = {
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@ventarosales.com',
      subject: '✅ Support Request Confirmed - We\'ll Be In Touch Soon!',
      html: clientConfirmationContent
    };

    let clientEmailSent = false;
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.placeholder_api_key_replace_with_real_key') {
      try {
        await sgMail.send(clientMsg);
        console.log('✅ Client confirmation email sent successfully');
        clientEmailSent = true;
      } catch (error) {
        console.error('❌ Failed to send client confirmation email:', error);
        console.error('Error details:', error);
      }
    } else {
      console.log('📧 SendGrid not configured - Client email would be sent:', clientMsg.subject);
      console.log('📧 Client email content saved to console for debugging');
      console.log('📧 To:', clientMsg.to);
      console.log('📧 Subject:', clientMsg.subject);
    }

    return NextResponse.json(
      {
        success: true,
        message: adminEmailSent && clientEmailSent 
          ? 'Support request submitted successfully. You will receive a confirmation email shortly.'
          : adminEmailSent 
          ? 'Support request submitted successfully. Admin has been notified, but confirmation email could not be sent.'
          : clientEmailSent
          ? 'Support request submitted successfully. You will receive a confirmation email shortly.'
          : 'Support request submitted successfully. Email notifications are currently unavailable, but your request has been logged.',
        emailStatus: {
          adminEmailSent,
          clientEmailSent,
          emailConfigured: !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.placeholder_api_key_replace_with_real_key')
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error processing support request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process support request',
        message: error.message 
      },
      { status: 500 }
    );
  }
}