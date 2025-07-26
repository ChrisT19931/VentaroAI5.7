import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { Resend } from 'resend';

// Create Resend client with fallback for build time
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - email features will not work');
    return null;
  }
  return new Resend(apiKey);
};

const resend = getResendClient();

// GET - Fetch all coaching bookings (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('coaching_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || []
    });

  } catch (error) {
    console.error('Error in admin coaching bookings GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status, adminNotes, meetingLink } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get the booking details before updating
    const { data: booking, error: fetchError } = await supabase
      .from('coaching_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update the booking
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }

    if (meetingLink !== undefined) {
      updateData.meeting_link = meetingLink;
    }

    if (status === 'confirmed') {
      updateData.confirmation_sent_at = new Date().toISOString();
    }

    const { data: updatedBooking, error: updateError } = await supabase
      .from('coaching_bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    // Send email notification to customer based on status
    try {
      if (resend) {
        let emailSubject = '';
        let emailContent = '';

        const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        };

        switch (status) {
          case 'confirmed':
            emailSubject = 'Coaching Session Confirmed! 🎉';
            emailContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🎉 Your Coaching Session is Confirmed!</h1>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${booking.user_name},</p>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Great news! Your coaching session has been confirmed and we're excited to work with you.
                  </p>
                  
                  <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1e40af; margin-top: 0;">📅 Session Details:</h3>
                    <ul style="color: #374151; line-height: 1.8;">
                      <li><strong>Date:</strong> ${formatDate(booking.scheduled_date)}</li>
                      <li><strong>Time:</strong> ${booking.scheduled_time} (${booking.timezone})</li>
                      <li><strong>Duration:</strong> 60 minutes</li>
                      <li><strong>Session Type:</strong> ${booking.session_type}</li>
                    </ul>
                  </div>
                  
                  ${meetingLink ? `
                  <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #16a34a; margin-top: 0;">🔗 Meeting Link:</h3>
                    <p style="color: #374151; margin: 0;">
                      <a href="${meetingLink}" style="color: #16a34a; font-weight: bold; text-decoration: none;">${meetingLink}</a>
                    </p>
                    <p style="color: #374151; font-size: 14px; margin-top: 10px;">
                      Please save this link and join the meeting at your scheduled time.
                    </p>
                  </div>
                  ` : ''}
                  
                  <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #d97706; margin-top: 0;">📋 Before Your Session:</h3>
                    <ul style="color: #374151; line-height: 1.8;">
                      <li>Prepare your questions and goals</li>
                      <li>Test your camera and microphone</li>
                      <li>Have a notepad ready for key insights</li>
                      <li>Join the meeting 2-3 minutes early</li>
                    </ul>
                  </div>
                  
                  ${adminNotes ? `
                  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #374151; margin-top: 0;">📝 Additional Notes:</h3>
                    <p style="color: #374151; margin: 0;">${adminNotes}</p>
                  </div>
                  ` : ''}
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    If you need to reschedule or have any questions, please contact us at chris.t@ventarosales.com
                  </p>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Looking forward to our session!<br>
                    The Ventaro AI Team
                  </p>
                </div>
              </div>
            `;
            break;

          case 'cancelled':
            emailSubject = 'Coaching Session Cancelled';
            emailContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Coaching Session Cancelled</h1>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${booking.user_name},</p>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    We regret to inform you that your coaching session scheduled for ${formatDate(booking.scheduled_date)} at ${booking.scheduled_time} has been cancelled.
                  </p>
                  
                  ${adminNotes ? `
                  <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #dc2626; margin-top: 0;">📝 Reason:</h3>
                    <p style="color: #374151; margin: 0;">${adminNotes}</p>
                  </div>
                  ` : ''}
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    To reschedule your session, please contact us at chris.t@ventarosales.com or book a new time slot.
                  </p>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    We apologize for any inconvenience.<br>
                    The Ventaro AI Team
                  </p>
                </div>
              </div>
            `;
            break;
        }

        if (emailSubject && emailContent) {
          await resend.emails.send({
            from: 'Ventaro AI <noreply@ventaroai.com>',
            to: [booking.user_email],
            subject: emailSubject,
            html: emailContent
          });
        }
      }
    } catch (emailError) {
      console.error('Error sending status update email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error in admin coaching bookings PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}