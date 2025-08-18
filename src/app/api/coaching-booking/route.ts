import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/database';
import { sendEmail } from '@/lib/sendgrid';

// Check if email is configured
const isEmailConfigured = !!process.env.SENDGRID_API_KEY && !!process.env.EMAIL_FROM;
console.log('📧 COACHING BOOKING: Email configuration check:', { 
  hasApiKey: !!process.env.SENDGRID_API_KEY,
  hasEmailFrom: !!process.env.EMAIL_FROM,
  isConfigured: isEmailConfigured
});

interface BookingData {
  name: string;
  email: string;
  phone?: string;
  business_stage: string;
  main_challenge: string;
  goals: string;
  preferred_date_time: string;
  additional_notes?: string;
}

// Validation schemas
const BUSINESS_STAGES = [
  'idea-stage',
  'startup',
  'growing-business',
  'established-business',
  'scaling-business'
] as const;

const validateBookingData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  if (!data.business_stage) errors.push('Business stage is required');
  if (!BUSINESS_STAGES.includes(data.business_stage)) {
    errors.push('Invalid business stage');
  }
  if (!data.main_challenge?.trim()) errors.push('Main challenge is required');
  if (!data.goals?.trim()) errors.push('Goals are required');
  if (!data.preferred_date_time) errors.push('Preferred date and time is required');

  // Validate date is in the future
  if (data.preferred_date_time) {
    const preferredDate = new Date(data.preferred_date_time);
    const now = new Date();
    if (preferredDate <= now) {
      errors.push('Preferred date must be in the future');
    }
    // Check if date is within next 6 months
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    if (preferredDate > sixMonthsFromNow) {
      errors.push('Preferred date must be within the next 6 months');
    }
  }

  if (data.phone && data.phone.trim() && !/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone.trim())) {
    errors.push('Valid phone number is required if provided');
  }

  return { isValid: errors.length === 0, errors };
};

const sendBookingConfirmationEmail = async (bookingData: BookingData & { id: string }) => {
  console.log('📧 COACHING BOOKING: Sending confirmation emails...');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Australia/Sydney'
    });
  };

  const businessStageLabels: Record<string, string> = {
    'idea-stage': 'Idea Stage',
    'startup': 'Startup',
    'growing-business': 'Growing Business',
    'established-business': 'Established Business',
    'scaling-business': 'Scaling Business'
  };

  // Send email to admin (SAME AS CONTACT FORM)
  const adminEmailResult = await sendEmail({
    to: 'chris.t@ventarosales.com',
    subject: `🔔 New Coaching Booking: ${bookingData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">🎯 New AI Business Coaching Session Booking</h2>
        
        <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #4c51bf;">📋 Contact Information</h3>
          <p><strong>Name:</strong> ${bookingData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${bookingData.email}">${bookingData.email}</a></p>
          ${bookingData.phone ? `<p><strong>Phone:</strong> <a href="tel:${bookingData.phone}">${bookingData.phone}</a></p>` : ''}
          <p><strong>Business Stage:</strong> ${businessStageLabels[bookingData.business_stage] || bookingData.business_stage}</p>
          <p><strong>Preferred Date:</strong> ${formatDate(bookingData.preferred_date_time)}</p>
          <p><strong>Booking ID:</strong> ${bookingData.id}</p>
        </div>

        <div style="background: #edf2f7; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #e53e3e;">🎯 Main Challenge</h3>
          <p>${bookingData.main_challenge}</p>
        </div>

        <div style="background: #e6fffa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #38a169;">🚀 Goals</h3>
          <p>${bookingData.goals}</p>
        </div>

        ${bookingData.additional_notes ? `
          <div style="background: #fef5e7; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #d69e2e;">📝 Additional Notes</h3>
            <p>${bookingData.additional_notes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; padding: 15px; background: #4c51bf; color: white; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: white; font-size: 16px;"><strong>🎯 ACTION REQUIRED</strong></p>
          <p style="margin: 5px 0 0 0; color: white; font-size: 14px;">
            <a href="mailto:${bookingData.email}?subject=Re: Your AI Business Coaching Session - Let's Schedule!" 
               style="color: white; text-decoration: underline;">📧 Reply to Customer</a>
          </p>
        </div>
      </div>
    `,
    text: `New AI Business Coaching Session Booking

Contact Information:
- Name: ${bookingData.name}
- Email: ${bookingData.email}
${bookingData.phone ? `- Phone: ${bookingData.phone}` : ''}
- Business Stage: ${businessStageLabels[bookingData.business_stage] || bookingData.business_stage}
- Preferred Date: ${formatDate(bookingData.preferred_date_time)}
- Booking ID: ${bookingData.id}

Main Challenge:
${bookingData.main_challenge}

Goals:
${bookingData.goals}

${bookingData.additional_notes ? `Additional Notes:\n${bookingData.additional_notes}` : ''}

Reply to: ${bookingData.email}`
  });

  // Send auto-reply to customer (SAME AS CONTACT FORM)
  const customerEmailResult = await sendEmail({
    to: bookingData.email,
    subject: '🎯 Your AI Business Coaching Session Request Received!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4c51bf; margin: 0; font-size: 28px;">🚀 Ventaro AI</h1>
            <h2 style="color: #2d3748; margin: 10px 0; font-size: 24px;">Coaching Session Request Received!</h2>
          </div>

          <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h3 style="color: #2d3748; margin-top: 0;">📅 Your Request Details</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${bookingData.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${bookingData.email}</p>
            <p style="margin: 8px 0;"><strong>Preferred Date & Time:</strong> ${formatDate(bookingData.preferred_date_time)}</p>
            <p style="margin: 8px 0;"><strong>Business Stage:</strong> ${businessStageLabels[bookingData.business_stage] || bookingData.business_stage}</p>
            <p style="margin: 8px 0;"><strong>Reference ID:</strong> ${bookingData.id}</p>
          </div>

          <div style="background: #e6fffa; border-left: 4px solid #38b2ac; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #2d3748; margin-top: 0;">✅ What Happens Next?</h3>
            <ul style="color: #2d3748; line-height: 1.6;">
              <li><strong>Within 2 hours:</strong> We'll review your request and confirm availability</li>
              <li><strong>Within 24 hours:</strong> You'll receive a calendar invite with the meeting link</li>
              <li><strong>Before the session:</strong> We'll send a prep questionnaire to maximize our time</li>
              <li><strong>During the session:</strong> 60 minutes of focused AI business strategy</li>
            </ul>
          </div>

          <div style="background: #edf2f7; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h3 style="color: #2d3748; margin-top: 0;">🎯 Your Goals & Challenges</h3>
            <p style="margin: 8px 0;"><strong>Main Challenge:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 8px; margin: 8px 0;">${bookingData.main_challenge}</p>
            <p style="margin: 8px 0;"><strong>Goals:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 8px; margin: 8px 0;">${bookingData.goals}</p>
            ${bookingData.additional_notes ? `
              <p style="margin: 8px 0;"><strong>Additional Notes:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 8px; margin: 8px 0;">${bookingData.additional_notes}</p>
            ` : ''}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #718096; font-size: 14px;">
              Questions? Reply to this email or contact us at 
              <a href="mailto:chris.t@ventarosales.com" style="color: #4c51bf;">chris.t@ventarosales.com</a>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; font-size: 12px;">
              © 2025 Ventaro AI. All rights reserved.<br>
              We're excited to help accelerate your AI business success!
            </p>
          </div>
        </div>
      </div>
    `,
    text: `AI Business Coaching Session Request Received!

Hi ${bookingData.name},

Thank you for your coaching session request! We've received your booking and our team will review it within 2 hours.

Your Request Details:
- Name: ${bookingData.name}
- Email: ${bookingData.email}
- Preferred Date: ${formatDate(bookingData.preferred_date_time)}
- Business Stage: ${businessStageLabels[bookingData.business_stage] || bookingData.business_stage}
- Reference ID: ${bookingData.id}

What Happens Next:
• Within 2 hours: We'll review and confirm availability
• Within 24 hours: You'll receive a calendar invite
• Before session: Prep questionnaire to maximize our time
• During session: 60 minutes of focused AI business strategy

Your Goals & Challenges:
Main Challenge: ${bookingData.main_challenge}
Goals: ${bookingData.goals}
${bookingData.additional_notes ? `Additional Notes: ${bookingData.additional_notes}` : ''}

Questions? Contact: chris.t@ventarosales.com

Best regards,
The Ventaro AI Team`
  });

  console.log(`📧 COACHING BOOKING: Admin email ${adminEmailResult.success ? 'sent' : 'failed'}`);
  console.log(`📧 COACHING BOOKING: Customer email ${customerEmailResult.success ? 'sent' : 'failed'}`);

  return {
    adminSent: adminEmailResult.success,
    customerSent: customerEmailResult.success
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get authentication token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate booking data
    const { isValid, errors } = validateBookingData(body);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Prepare booking data
    const bookingData: BookingData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      business_stage: body.business_stage,
      main_challenge: body.main_challenge.trim(),
      goals: body.goals.trim(),
      preferred_date_time: body.preferred_date_time,
      additional_notes: body.additional_notes?.trim() || null
    };

    // Check for duplicate bookings (same email within 24 hours)
    const recentBookings = await db.getRecentBookings?.(bookingData.email, 24);
    if (recentBookings && recentBookings.length > 0) {
      return NextResponse.json(
        { 
          error: 'Duplicate booking detected',
          message: 'You already have a recent booking. Please wait 24 hours before booking again or contact support.'
        },
        { status: 409 }
      );
    }

    // Create booking in database
    const booking = await db.createBooking?.({
      user_id: token.id as string,
      ...bookingData
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Send confirmation emails (SAME AS CONTACT FORM)
    const emailResults = await sendBookingConfirmationEmail({
      ...bookingData,
      id: booking.id
    });

    // Log successful booking
    console.log(`📅 New coaching booking created: ${booking.id} for ${bookingData.email}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your coaching session request! We\'ll contact you within 24 hours to confirm your session.',
      booking: {
        id: booking.id,
        status: booking.status,
        created_at: booking.created_at
      },
      emailsSent: {
        admin: emailResults.adminSent,
        customer: emailResults.customerSent
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Coaching booking error:', error);
    return NextResponse.json(
      { 
        error: 'Booking failed',
        message: 'An error occurred while processing your booking. Please try again.'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's bookings
    const userBookings = await db.getUserBookings?.(token.id as string);
    
    if (!userBookings) {
      return NextResponse.json({ bookings: [] });
    }

    return NextResponse.json({
      bookings: userBookings.map(booking => ({
        id: booking.id,
        name: booking.name,
        email: booking.email,
        business_stage: booking.business_stage,
        preferred_date_time: booking.preferred_date_time,
        status: booking.status,
        created_at: booking.created_at
      }))
    });

  } catch (error) {
    console.error('❌ Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}