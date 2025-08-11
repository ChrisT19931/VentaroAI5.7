import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Use Supabase to update the user's password with the token
    const { error } = await supabase.auth.resetPasswordForEmail(password, {
      token,
    });

    if (error) {
      console.error('Password reset error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to reset password' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Password reset exception:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}