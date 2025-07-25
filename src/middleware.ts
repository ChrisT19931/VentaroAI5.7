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
  const path = req.nextUrl.pathname;
  console.log('Simple middleware executing for path:', path);

  // Check for simple auth cookie
  const authCookie = req.cookies.get('ventaro-auth');
  const isAuthenticated = authCookie?.value === 'true';
  
  console.log('Auth cookie present:', isAuthenticated);

  // Handle protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('Redirecting from protected route to login:', path);
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.log('User accessing protected route:', path);
    }
  }

  // Handle admin routes (for now, just check if authenticated)
  if (adminRoutes.some(route => path.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('Redirecting from admin route to login:', path);
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle login/signup routes when user is already logged in
  if ((path === '/login' || path === '/signup') && isAuthenticated) {
    console.log('User already logged in, redirecting from', path, 'to /my-account');
    return NextResponse.redirect(new URL('/my-account', req.url));
  }

  return NextResponse.next();
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