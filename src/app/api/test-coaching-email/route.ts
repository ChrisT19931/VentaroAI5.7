import { NextRequest, NextResponse } from 'next/server';
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

    // Send confirmation email to customer
    try {
      await sendEmail({
        to: userEmail,
        from: 'noreply@ventarosales.com',
        subject: 'Coaching Session Booking Confirmation - Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; margin-bottom: 30px;">📅 Test Booking Request!</h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${userName || 'there'},</p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                This is a test email for coaching session booking functionality.
              </p>
              
              <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">📋 Test Booking Details:</h3>
                <ul style="color: #374151; line-height: 1.8;">
                  <li><strong>Session Type:</strong> ${sessionType || 'AI Business Strategy Session'}</li>
                  <li><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li><strong>Time:</strong> ${selectedTime}</li>
                  <li><strong>Timezone:</strong> ${timezone}</li>
                  <li><strong>Notes:</strong> ${notes || 'None'}</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                This is a test email to verify email functionality is working correctly.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #999; font-size: 14px;">Best regards,<br>Ventaro AI Team</p>
              </div>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error sending customer email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send customer email' },
        { status: 500 }
      );
    }

    // Send notification email to admin
    try {
      await sendEmail({
        to: 'chris.t@ventarosales.com',
        from: 'noreply@ventarosales.com',
        subject: 'New Coaching Session Booking Request - Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🔔 New Test Booking Request</h1>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #d97706; margin-top: 0;">👤 Customer Information:</h3>
                <ul style="color: #374151; line-height: 1.8;">
                  <li><strong>Name:</strong> ${userName || 'Not provided'}</li>
                  <li><strong>Email:</strong> ${userEmail}</li>
                  <li><strong>User ID:</strong> ${userId}</li>
                </ul>
              </div>
              
              <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">📋 Booking Details:</h3>
                <ul style="color: #374151; line-height: 1.8;">
                  <li><strong>Session Type:</strong> ${sessionType || 'AI Business Strategy Session'}</li>
                  <li><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li><strong>Time:</strong> ${selectedTime}</li>
                  <li><strong>Timezone:</strong> ${timezone}</li>
                  <li><strong>Notes:</strong> ${notes || 'None'}</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                This is a test booking request to verify email functionality.
              </p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error sending admin email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send admin email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test emails sent successfully',
      details: {
        customerEmail: userEmail,
        adminEmail: 'chris.t@ventarosales.com',
        bookingDetails: {
          date: selectedDate,
          time: selectedTime,
          timezone: timezone
        }
      }
    });

  } catch (error) {
    console.error('Error in test coaching email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}