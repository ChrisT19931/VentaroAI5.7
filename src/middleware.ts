import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/account',
  '/checkout',
  '/checkout/success',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
];

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
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
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  // Get the current path
  const path = req.nextUrl.pathname;
  
  // Check if session exists
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Handle protected routes
  if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
    // Redirect to login if trying to access protected route without session
    const redirectUrl = new URL('/login', req.url);
    // Add the original URL as a query parameter to redirect after login
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Handle admin routes
  if (adminRoutes.some(route => path.startsWith(route))) {
    if (!session) {
      // Redirect to login if no session
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (!profile || profile.role !== 'admin') {
      // Redirect to home if user is not an admin
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  // Handle login/signup routes when user is already logged in
  if ((path === '/login' || path === '/signup') && session) {
    // Get the redirectTo query parameter or default to home
    const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/';
    return NextResponse.redirect(new URL(redirectTo, req.url));
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