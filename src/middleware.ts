import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
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
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
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
  
  return res;
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
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.svg).*)',
  ],
};