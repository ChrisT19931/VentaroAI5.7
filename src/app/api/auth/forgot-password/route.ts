import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Use Supabase to send a password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      console.error('Password reset email error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send password reset email' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Password reset email exception:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}