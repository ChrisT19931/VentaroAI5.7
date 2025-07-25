import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/my-account',
  '/checkout',
  '/checkout/success',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
];

export async function middleware(req: NextRequest) {
  // Create a response object that we'll manipulate
  let response = NextResponse.next();
  
  // Get the current path
  const path = req.nextUrl.pathname;
  console.log('Middleware executing for path:', path);

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
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // If the cookie is updated, update the cookies for the request and response
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          // If the cookie is removed, update the cookies for the request and response
          req.cookies.delete({
            name,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );
  
  // Get session and refresh if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Attempt to refresh the session if it exists but might be expired
  if (session) {
    const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
    console.log('Session refreshed in middleware:', refreshedSession ? `User: ${refreshedSession.user.email}` : 'Refresh failed');
  }
  
  // Get the final session state after potential refresh
  const { data: { session: finalSession } } = await supabase.auth.getSession();
  console.log('Final session in middleware:', finalSession ? `User: ${finalSession.user.email}` : 'No session');
  
  // Use the final session for authorization checks
  const activeSession = finalSession || session;
  
  // Handle protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!activeSession) {
      console.log('Redirecting from protected route to login:', path);
      // Redirect to login if trying to access protected route without session
      const redirectUrl = new URL('/login', req.url);
      // Add the original URL as a query parameter to redirect after login
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.log('User accessing protected route:', path, 'User:', activeSession.user.email);
    }
  }
  
  // Handle admin routes
  if (adminRoutes.some(route => path.startsWith(route))) {
    if (!activeSession) {
      console.log('Redirecting from admin route to login:', path);
      // Redirect to login if no session
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user has admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', activeSession.user.id)
      .single();
    
    console.log('Admin check for user:', activeSession.user.email, 'Result:', profile?.is_admin);
    
    if (!profile || profile.is_admin !== true) {
      // Redirect to home if user is not an admin
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  // Handle login/signup routes when user is already logged in
  if ((path === '/login' || path === '/signup') && activeSession) {
    // Always redirect to my-account page for authenticated users
    console.log('Middleware: User already logged in, redirecting from', path, 'to /my-account');
    console.log('Middleware: Session user:', activeSession.user.email);
    return NextResponse.redirect(new URL('/my-account', req.url));
  }
  
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - downloads folder
     */
    '/((?!_next/static|_next/image|favicon.ico|downloads|.*\.svg).*)',
  ],
};