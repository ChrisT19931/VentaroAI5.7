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
  
  // Log all cookies for debugging
  const allCookies = Object.fromEntries(req.cookies.getAll().map(c => [c.name, c.value]));
  console.log('All cookies:', allCookies);
  console.log('Auth cookie present:', isAuthenticated);
  console.log('Auth cookie details:', authCookie ? JSON.stringify(authCookie) : 'null');
  
  // Add a longer delay to ensure cookie processing is complete
  // This can help prevent flashing issues during authentication checks
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Check for Supabase auth cookies - but don't rely on them for authentication
  // This is just for debugging purposes
  const supabaseAccessToken = req.cookies.get('sb-access-token');
  const supabaseRefreshToken = req.cookies.get('sb-refresh-token');
  console.log('Supabase cookies present:', !!supabaseAccessToken, !!supabaseRefreshToken);
  
  // We'll only use the ventaro-auth cookie for authentication decisions
  // This simplifies the auth flow and prevents flashing issues

  // Handle protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('Redirecting from protected route to login:', path);
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.log('User accessing protected route:', path);
    }
  }

  // Allow all authenticated users to access admin routes
if (adminRoutes.some(route => path.startsWith(route))) {
  if (!isAuthenticated) {
    console.log('Redirecting from admin route to login:', path);
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  console.log('User accessing admin route:', path);
}

  // Allow access to clear-auth route regardless of authentication status
  if (path === '/clear-auth') {
    console.log('Allowing access to clear-auth route');
    return NextResponse.next();
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
     * - downloads folder and files
     */
    '/((?!_next/static|_next/image|favicon.ico|public|downloads|.*\.svg|.*\.pdf).*)',
  ],
};