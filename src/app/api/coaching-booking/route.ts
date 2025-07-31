import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userEmail,
      userName,
      selectedDate,
      selectedTime,
      timezone,
      sessionType,
      notes
    } = body;

    // Validate required fields
    if (!userId || !userEmail || !selectedDate || !selectedTime || !timezone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }



    // Check if the time slot is already booked
    const { data: existingBooking, error: checkError } = await supabase
      .from('coaching_bookings')
      .select('*')
      .eq('scheduled_date', selectedDate)
      .eq('scheduled_time', selectedTime)
      .eq('status', 'confirmed')
      .single();

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    // Create the booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('coaching_bookings')
      .insert({
        user_id: userId,
        user_email: userEmail,
        user_name: userName,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        timezone,
        session_type: sessionType || 'AI Business Strategy Session',
        notes: notes || '',
        status: 'pending_confirmation',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    try {
      await sendEmail({
        to: userEmail,
        from: 'noreply@ventarosales.com',
        subject: 'Coaching Session Booking Confirmation - Pending Approval',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #333; text-align: center; margin-bottom: 30px;">📅 Booking Request Received!</h1>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${userName || 'there'},</p>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  Thank you for booking your coaching session! We've received your request and it's currently pending confirmation.
                </p>
                
                <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">📋 Booking Details:</h3>
                  <ul style="color: #374151; line-height: 1.8;">
                    <li><strong>Session Type:</strong> ${sessionType || 'AI Business Strategy Session'}</li>
                    <li><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                    <li><strong>Time:</strong> ${selectedTime}</li>
                    <li><strong>Timezone:</strong> ${timezone}</li>
                    <li><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Confirmation</span></li>
                  </ul>
                </div>
                
                <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #d97706; margin-top: 0;">⏰ What Happens Next:</h3>
                  <ol style="color: #374151; line-height: 1.8;">
                    <li><strong>Within 24 hours:</strong> Chris will review and confirm your booking</li>
                    <li><strong>Confirmation Email:</strong> You'll receive a confirmation with the meeting link</li>
                    <li><strong>Calendar Invite:</strong> A calendar invitation will be sent to your email</li>
                    <li><strong>Pre-Session:</strong> Preparation materials will be sent 24 hours before</li>
                  </ol>
                </div>
                
                <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #16a34a; margin-top: 0;">📞 Contact Information:</h3>
                  <p style="color: #374151; margin: 0;">
                    If you need to make changes or have questions:<br>
                    <strong>chris.t@ventarosales.com</strong>
                  </p>
                </div>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  We're excited to help you achieve your business goals!
                </p>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  Kind Regards,<br>
                  Ventaro AI
                </p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 14px;">Ventaro AI Digital Store</p>
                </div>
              </div>
            </div>
          `
        });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    // Send notification email to admin
    try {
      await sendEmail({
        to: 'chris.t@ventarosales.com',
        from: 'noreply@ventarosales.com',
        subject: `New Coaching Booking Request - ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333;">📅 New Coaching Session Booking</h1>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Customer Information:</h3>
                <p><strong>Name:</strong> ${userName || 'Not provided'}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>User ID:</strong> ${userId}</p>
              </div>
              
              <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Booking Details:</h3>
                <p><strong>Session Type:</strong> ${sessionType || 'AI Business Strategy Session'}</p>
                <p><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${selectedTime}</p>
                <p><strong>Timezone:</strong> ${timezone}</p>
                <p><strong>Status:</strong> Pending Confirmation</p>
              </div>
              
              ${notes ? `
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Customer Notes:</h3>
                <p>${notes}</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/coaching-bookings" 
                   style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Review Booking
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <p style="color: #666;">Please confirm or reschedule this booking within 24 hours.</p>
              </div>
            </div>
          `
        });
    } catch (adminEmailError) {
      console.error('Error sending admin notification:', adminEmailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully',
      bookingId: bookingData.id,
      status: 'pending_confirmation'
    });

  } catch (error) {
    console.error('Error in coaching booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch available time slots
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    

    // Get all bookings for the specified date
    const { data: bookings, error } = await supabase
      .from('coaching_bookings')
      .select('scheduled_time')
      .eq('scheduled_date', date)
      .in('status', ['confirmed', 'pending_confirmation']);

    if (error) {
      console.error('Error fetching bookings:', error);
      // Return empty bookings array if table doesn't exist yet
      console.log('Table may not exist, returning empty bookings for now');
    }

    // Define available time slots (9 AM to 5 PM, 1-hour slots)
    const availableSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Filter out booked slots
    const bookedTimes = (error || !bookings) ? [] : bookings.map(booking => booking.scheduled_time);
    const freeSlots = availableSlots.filter(slot => !bookedTimes.includes(slot));

    return NextResponse.json({
      success: true,
      availableSlots: freeSlots,
      bookedSlots: bookedTimes
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}