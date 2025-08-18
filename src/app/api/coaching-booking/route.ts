import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/database';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const isEmailConfigured = !!process.env.SENDGRID_API_KEY && !!process.env.EMAIL_FROM;
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid configured for coaching booking emails');
} else {
  console.warn('⚠️ SendGrid API key not configured - coaching booking emails will be logged only');
}

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
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.warn('SendGrid not configured, skipping email');
    return;
  }

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

  // Email to customer
  const customerEmail = {
    to: bookingData.email,
    from: process.env.EMAIL_FROM,
    subject: '🎯 Your AI Business Coaching Session is Booked!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4c51bf; margin: 0; font-size: 28px;">🚀 Ventaro AI</h1>
            <h2 style="color: #2d3748; margin: 10px 0; font-size: 24px;">Coaching Session Confirmed!</h2>
          </div>

          <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h3 style="color: #2d3748; margin-top: 0;">📅 Session Details</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${bookingData.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${bookingData.email}</p>
            ${bookingData.phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> ${bookingData.phone}</p>` : ''}
            <p style="margin: 8px 0;"><strong>Preferred Date & Time:</strong> ${formatDate(bookingData.preferred_date_time)}</p>
            <p style="margin: 8px 0;"><strong>Business Stage:</strong> ${businessStageLabels[bookingData.business_stage] || bookingData.business_stage}</p>
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

          <div style="background: #e6fffa; border-left: 4px solid #38b2ac; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #2d3748; margin-top: 0;">✅ What Happens Next?</h3>
            <ul style="color: #2d3748; line-height: 1.6;">
              <li>We'll review your submission and confirm your session within 24 hours</li>
              <li>You'll receive a calendar invite with the meeting link</li>
              <li>We'll send you a pre-session questionnaire to maximize our time together</li>
              <li>Come prepared with specific questions about your AI business goals</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #718096; font-size: 14px;">
              Questions? Reply to this email or contact us at 
              <a href="mailto:${process.env.EMAIL_FROM}" style="color: #4c51bf;">${process.env.EMAIL_FROM}</a>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; font-size: 12px;">
              Booking ID: ${bookingData.id}<br>
              © 2024 Ventaro AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  };

  // Email to admin
  const adminEmail = {
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM,
    from: process.env.EMAIL_FROM,
    subject: `🔔 New Coaching Booking: ${bookingData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">New Coaching Session Booking</h2>
        
        <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${bookingData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${bookingData.email}">${bookingData.email}</a></p>
          ${bookingData.phone ? `<p><strong>Phone:</strong> <a href="tel:${bookingData.phone}">${bookingData.phone}</a></p>` : ''}
          <p><strong>Business Stage:</strong> ${businessStageLabels[bookingData.business_stage]}</p>
          <p><strong>Preferred Date:</strong> ${formatDate(bookingData.preferred_date_time)}</p>
        </div>

        <div style="background: #edf2f7; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3>Main Challenge</h3>
          <p>${bookingData.main_challenge}</p>
        </div>

        <div style="background: #e6fffa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3>Goals</h3>
          <p>${bookingData.goals}</p>
        </div>

        ${bookingData.additional_notes ? `
          <div style="background: #fef5e7; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3>Additional Notes</h3>
            <p>${bookingData.additional_notes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; padding: 15px; background: #4c51bf; color: white; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: white;"><strong>Booking ID:</strong> ${bookingData.id}</p>
          <p style="margin: 5px 0 0 0; color: white; font-size: 14px;">
            <a href="mailto:${bookingData.email}?subject=Re: Your AI Business Coaching Session" 
               style="color: white; text-decoration: underline;">Reply to Customer</a>
          </p>
        </div>
      </div>
    `
  };

  if (!isEmailConfigured) {
    console.log('📧 Email not configured - logging booking details instead:');
    console.log('✅ BOOKING CONFIRMATION EMAIL (SIMULATED)');
    console.log('==========================================');
    console.log('📨 Customer email would be sent to:', bookingData.email);
    console.log('📨 Admin email would be sent to:', process.env.EMAIL_FROM || 'chris.t@ventarosales.com');
    console.log('📋 Booking Details:');
    console.log('   - ID:', bookingData.id);
    console.log('   - Name:', bookingData.name);
    console.log('   - Email:', bookingData.email);
    console.log('   - Phone:', bookingData.phone || 'Not provided');
    console.log('   - Preferred Date/Time:', formatDate(bookingData.preferred_date_time));
    console.log('   - Business Stage:', businessStageLabels[bookingData.business_stage] || bookingData.business_stage);
    console.log('   - Main Challenge:', bookingData.main_challenge);
    console.log('   - Goals:', bookingData.goals);
    console.log('   - Additional Notes:', bookingData.additional_notes || 'None');
    console.log('==========================================');
    console.log('🔧 To enable real emails, configure SENDGRID_API_KEY and EMAIL_FROM in .env.local');
    return; // Don't try to send emails if not configured
  }

  try {
    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(adminEmail)
    ]);
    console.log('✅ Booking confirmation emails sent successfully to:', bookingData.email);
  } catch (error: any) {
    console.error('❌ Failed to send booking emails:', error);
    console.error('Email error details:', {
      error: error?.message,
      code: error?.code,
      response: error?.response?.body
    });
    throw error; // Re-throw to handle in calling function
  }
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

    // Send confirmation emails (don't let email failure block booking)
    try {
      await sendBookingConfirmationEmail({
        ...bookingData,
        id: booking.id
      });
      console.log(`✅ Confirmation emails sent for booking ${booking.id}`);
    } catch (emailError) {
      console.error(`❌ Failed to send confirmation emails for booking ${booking.id}:`, emailError);
      // Don't fail the booking if email fails - booking is still valid
    }

    // Log successful booking
    console.log(`📅 New coaching booking created: ${booking.id} for ${bookingData.email}`);

    return NextResponse.json({
      success: true,
      message: isEmailConfigured 
        ? 'Coaching session booked successfully! Check your email for confirmation.'
        : 'Coaching session booked successfully! Email notifications are currently in development mode - check server logs for booking details.',
      booking: {
        id: booking.id,
        status: booking.status,
        created_at: booking.created_at
      },
      emailStatus: isEmailConfigured ? 'sent' : 'simulated'
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