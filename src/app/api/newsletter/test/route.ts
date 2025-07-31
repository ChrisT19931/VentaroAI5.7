import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/sendgrid';

export async function GET(request: NextRequest) {
  try {
    // Log that the test endpoint was called
    console.log('Newsletter test endpoint called');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Newsletter test endpoint is working' 
    });
  } catch (error) {
    console.error('Newsletter test error:', error);
    return NextResponse.json(
      { success: false, message: 'Test failed', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Log the test subscription
    console.log('Test subscription for:', email);
    
    // Don't actually send the email in test mode
    // Just return success
    
    return NextResponse.json({ 
      success: true, 
      message: `Test subscription successful for ${email}` 
    });
  } catch (error) {
    console.error('Newsletter test subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Test failed', error: String(error) },
      { status: 500 }
    );
  }
}