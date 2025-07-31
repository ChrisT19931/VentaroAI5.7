import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/sendgrid';

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

    // For now, we'll just send a welcome email
    try {
      await sendWelcomeEmail({ email });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with the subscription process even if the email fails
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