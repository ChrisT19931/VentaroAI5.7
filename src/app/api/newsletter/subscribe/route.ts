import { NextResponse } from 'next/server';
import { sendWelcomeEmail, sendEmail } from '@/lib/sendgrid';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Check if the email already exists in your database
    // 2. Add the email to your newsletter subscribers list
    // 3. Potentially integrate with an email service provider like Mailchimp, SendGrid, etc.

    // Send welcome email to subscriber
    try {
      await sendWelcomeEmail({ email });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with the subscription process even if the email fails
    }
    
    // Send notification email to Chris
    try {
      await sendEmail({
        to: 'chris.t@ventarosales.com',
        subject: 'New Newsletter Subscription',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">New Newsletter Subscription</h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Subscriber Information:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>This subscriber has been added to your newsletter list.</p>
          </div>
        `,
        text: `
          New Newsletter Subscription
          
          Subscriber Information:
          Email: ${email}
          Date: ${new Date().toLocaleString()}
          
          This subscriber has been added to your newsletter list.
        `
      });
    } catch (notificationError) {
      console.error('Failed to send notification email:', notificationError);
      // Continue with the subscription process even if the notification email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe to the newsletter' },
      { status: 500 }
    );
  }
}