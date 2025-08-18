import { NextRequest, NextResponse } from 'next/server';
import { sendEmailWithValidation } from '@/lib/sendgrid';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old rate limit entries
const cleanupRateLimit = () => {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  });
};

// Check rate limit (2 bookings per day per email)
const checkRateLimit = (email: string): { allowed: boolean; remaining: number } => {
  cleanupRateLimit();
  
  const now = Date.now();
  const resetTime = new Date().setHours(24, 0, 0, 0); // Reset at midnight
  const key = `consultation_booking_${email}`;
  
  const current = rateLimitStore.get(key) || { count: 0, resetTime };
  
  if (now > current.resetTime) {
    // Reset counter for new day
    current.count = 0;
    current.resetTime = resetTime;
  }
  
  const allowed = current.count < 2;
  const remaining = Math.max(0, 2 - current.count);
  
  if (allowed) {
    current.count++;
    rateLimitStore.set(key, current);
  }
  
  return { allowed, remaining };
};

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      userEmail, 
      userName, 
      selectedDate, 
      selectedTime, 
      timezone, 
      businessType,
      currentChallenges,
      goals,
      notes,
      sessionType 
    } = await request.json();

    // Validate required fields
    if (!userId || !userEmail || !userName || !selectedDate || !selectedTime || !businessType || !currentChallenges || !goals) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(userEmail);
    if (!rateLimit.allowed) {
      console.log(`❌ CONSULTATION BOOKING: Rate limit exceeded for ${userEmail}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'You have reached the maximum number of consultation bookings for today. Please try again tomorrow.',
          remaining: 0
        },
        { status: 429 }
      );
    }

    console.log(`✅ CONSULTATION BOOKING: Rate limit check passed. Remaining: ${rateLimit.remaining}`);

    // Generate booking ID
    const bookingId = `CONSULT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Format date and time
    const bookingDate = new Date(selectedDate);
    const formattedDate = bookingDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const [hours, minutes] = selectedTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    // Validate email configuration
    if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured. Please set SENDGRID_API_KEY and EMAIL_FROM.' },
        { status: 500 }
      );
    }

    // Send admin notification email
    const adminEmailResult = await sendEmailWithValidation({
      to: process.env.ADMIN_EMAIL || 'chris.t@ventarosales.com',
      subject: `🚀 New AI Business Consultation Booking - ${userName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New AI Business Consultation Booking</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 25px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚀 New AI Business Consultation Booking</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Support Package - Premium Consultation</p>
          </div>
          
          <div style="background: white; padding: 35px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">📅 Booking Details</h2>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 5px solid #0ea5e9; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin-top: 0;">📆 Scheduled Session</h3>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Time:</strong> ${formattedTime} (${timezone})</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Duration:</strong> 60 minutes</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Booking ID:</strong> ${bookingId}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%; background: #f8f9fa;">Name:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${userName}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Email:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="mailto:${userEmail}" style="color: #4f46e5; text-decoration: none;">${userEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">User ID:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${userId}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa;">Business Type:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${businessType}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; background: #f8f9fa;">Booked:</td>
                <td style="padding: 12px;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
            
            <h3 style="color: #333; margin-top: 35px; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">🎯 Current Challenges</h3>
            <div style="background: #fef2f2; padding: 25px; border-radius: 10px; border-left: 5px solid #ef4444; margin: 15px 0;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${currentChallenges}</p>
            </div>
            
            <h3 style="color: #333; margin-top: 35px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">🚀 Goals & Objectives</h3>
            <div style="background: #f0fdf4; padding: 25px; border-radius: 10px; border-left: 5px solid #10b981; margin: 15px 0;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${goals}</p>
            </div>
            
            ${notes ? `
              <h3 style="color: #333; margin-top: 35px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">📝 Additional Notes</h3>
              <div style="background: #faf5ff; padding: 25px; border-radius: 10px; border-left: 5px solid #7c3aed; margin: 15px 0;">
                <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${notes}</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 35px; padding: 20px; background: #eff6ff; border-radius: 10px; border: 1px solid #dbeafe;">
              <h4 style="margin-top: 0; color: #1e40af; font-size: 16px;">📊 Next Steps</h4>
              <ul style="margin: 10px 0; padding-left: 20px; color: #1976d2;">
                <li>Create Google Meet link and calendar invite</li>
                <li>Prepare consultation materials based on their challenges</li>
                <li>Review their business type and goals beforehand</li>
                <li>Send confirmation email with meeting details</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 10px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                🎯 <strong>High-Value Consultation Opportunity</strong><br>
                Support Package Customer - Premium Service Expected
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    // Send customer confirmation email
    const customerEmailResult = await sendEmailWithValidation({
      to: userEmail,
      subject: `✅ Your AI Business Consultation is Confirmed - ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>AI Business Consultation Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 25px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Consultation Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your AI Business Strategy Session is Booked</p>
          </div>
          
          <div style="background: white; padding: 35px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; margin-bottom: 25px;">Hi ${userName},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Great news! Your AI Business Consultation has been successfully booked. I'm excited to help you accelerate your AI-powered business success.
            </p>
            
            <div style="background: #f0f9ff; padding: 25px; border-radius: 10px; border-left: 5px solid #0ea5e9; margin: 25px 0;">
              <h3 style="color: #0c4a6e; margin-top: 0;">📅 Your Consultation Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 25%;">Date:</td>
                  <td style="padding: 8px 0;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Time:</td>
                  <td style="padding: 8px 0;">${formattedTime} (${timezone})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
                  <td style="padding: 8px 0;">60 minutes</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Format:</td>
                  <td style="padding: 8px 0;">Video call via Google Meet</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Booking ID:</td>
                  <td style="padding: 8px 0;">${bookingId}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 5px solid #f59e0b; margin: 25px 0;">
              <h4 style="color: #92400e; margin-top: 0;">⚡ What to Expect</h4>
              <ul style="margin: 10px 0; padding-left: 20px; color: #92400e;">
                <li>Personalized AI strategy for your ${businessType} business</li>
                <li>Solutions to your current challenges</li>
                <li>Action plan to achieve your goals</li>
                <li>Resource recommendations and next steps</li>
                <li>Follow-up email with session summary</li>
              </ul>
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border-left: 5px solid #10b981; margin: 25px 0;">
              <h4 style="color: #065f46; margin-top: 0;">📋 How to Prepare</h4>
              <ul style="margin: 10px 0; padding-left: 20px; color: #065f46;">
                <li>Have your current website/business ready to discuss</li>
                <li>Prepare specific questions about AI implementation</li>
                <li>Think about your 3-month and 6-month business goals</li>
                <li>Be ready to share your screen if needed</li>
                <li>Have a notebook ready for action items</li>
              </ul>
            </div>
            
            <div style="background: #ede9fe; padding: 20px; border-radius: 10px; border-left: 5px solid #7c3aed; margin: 25px 0;">
              <h4 style="color: #5b21b6; margin-top: 0;">📞 Meeting Details</h4>
              <p style="margin: 10px 0; color: #5b21b6;">
                <strong>Google Meet link will be sent 24 hours before your session.</strong><br>
                You'll also receive a calendar invite with all the details.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; margin-bottom: 15px;">Questions before our session?</p>
              <a href="mailto:chris.t@ventarosales.com" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Contact Support</a>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 10px;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Looking forward to helping you build your AI-powered business empire!<br>
                <strong>- Chris T, AI Business Strategist</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('📧 CONSULTATION BOOKING: Admin email result:', adminEmailResult.success ? 'Success' : 'Failed');
    console.log('📧 CONSULTATION BOOKING: Customer email result:', customerEmailResult.success ? 'Success' : 'Failed');

    if (!adminEmailResult.success || !customerEmailResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to send confirmation emails. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation booked successfully',
      bookingId,
      scheduledDate: formattedDate,
      scheduledTime: formattedTime,
      timezone
    });

  } catch (error) {
    console.error('❌ CONSULTATION BOOKING: Error processing booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 