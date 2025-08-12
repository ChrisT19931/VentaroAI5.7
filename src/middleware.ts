import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { PRODUCT_MAPPINGS, LEGACY_PRODUCT_MAPPINGS } from '@/config/products';

// Define protected routes that require authentication
const protectedRoutes = [
  '/my-account',
  '/checkout',
  '/checkout/success',
  '/downloads',
  '/vip-portal',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
];

// Define routes that require specific product entitlements
const productProtectedRoutes: Record<string, string[]> = {
  '/downloads/ebook': ['ebook', '1'],
  '/downloads/prompts': ['prompts', '2'],
  '/downloads/video': ['video', '4'],
  '/vip-portal': ['support', '5'],
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log('Middleware executing for path:', path);
  
  // Skip middleware for API routes and static files
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.startsWith('/images') ||
    path.includes('.') // Static files like favicon.ico
  ) {
    return NextResponse.next();
  }
  
  // Get the user's session token from NextAuth
  let token = null;
  let isAuthenticated = false;
  
  try {
    token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    isAuthenticated = !!token;
    console.log('User authenticated:', isAuthenticated);
  } catch (error) {
    console.error('Error getting token in middleware:', error);
    // Continue as unauthenticated if there's an error
    console.log('Authentication error, treating as unauthenticated');
  }
  
  // Handle protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('Redirecting from protected route to signin:', path);
      const redirectUrl = new URL('/signin', req.url);
      redirectUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.log('User accessing protected route:', path);
      
      // Check for product-specific protection
      for (const [protectedPath, requiredProducts] of Object.entries(productProtectedRoutes)) {
        if (path === protectedPath || path.startsWith(`${protectedPath}/`)) {
          // Check if user has the required entitlement
          const userEntitlements = token.entitlements as string[] || [];
          const hasAccess = requiredProducts.some(product => userEntitlements.includes(product));
          
          if (!hasAccess) {
            console.log('User lacks required entitlement for:', path);
            // Redirect to products page if user doesn't have access
            return NextResponse.redirect(new URL('/products', req.url));
          }
        }
      }
    }
  }

  // Handle admin routes - check for admin role in token
  if (adminRoutes.some(route => path.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('Redirecting from admin route to signin:', path);
      const redirectUrl = new URL('/signin', req.url);
      redirectUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user has admin role
    const userRoles = token.roles as string[] || [];
    if (!userRoles.includes('admin')) {
      console.log('User lacks admin role, redirecting to home');
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    console.log('Admin user accessing admin route:', path);
  }

  // Allow access to public routes regardless of authentication status
  if (path === '/signin' || path === '/register' || path === '/clear-auth') {
    console.log('Allowing access to public route:', path);
    return NextResponse.next();
  }
  
  // Add user info to headers for use in the application
  const response = NextResponse.next();
  if (isAuthenticated && token) {
    response.headers.set('x-user-id', token.sub as string);
    response.headers.set('x-user-email', token.email as string);
    response.headers.set('x-user-authenticated', 'true');
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
     * - downloads folder and files
     */
    '/((?!_next/static|_next/image|favicon.ico|public|downloads|.*\.svg|.*\.pdf).*)',
  ],
};