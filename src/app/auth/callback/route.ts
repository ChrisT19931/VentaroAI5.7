import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey: 'ventaro-store-auth-token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const type = searchParams.get('type');

  if (code) {
    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // If this is an email confirmation (signup), redirect to confirmation page
      if (type === 'signup' || (!next && !type)) {
        return NextResponse.redirect(new URL('/auth/confirmed', req.url));
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/my-account', req.url));
}