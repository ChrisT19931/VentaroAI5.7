# Vercel Deployment Guide

## Required Environment Variables

To successfully deploy this application to Vercel, you need to configure the following environment variables in your Vercel project settings:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-side only)

### Stripe Configuration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key (server-side only)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret for handling webhooks

### Email Configuration (Choose one)

#### SendGrid (Recommended)
- `SENDGRID_API_KEY`: Your SendGrid API key
- `SENDGRID_FROM_EMAIL`: Your verified sender email address

#### Resend (Alternative)
- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Your verified sender email address

### Site Configuration
- `NEXT_PUBLIC_BASE_URL`: Your production domain (e.g., https://yourdomain.com)
- `NEXT_PUBLIC_SITE_URL`: Same as above

### Optional Configuration
- `DATABASE_URL`: If using external database (PostgreSQL connection string)
- `NEXTAUTH_SECRET`: For NextAuth.js (if implemented)
- `GOOGLE_ANALYTICS_ID`: For Google Analytics tracking
- `SENTRY_DSN`: For error tracking with Sentry

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Settings > Environment Variables
4. Add all the required variables listed above
5. Deploy your project

## Build Optimization

The project has been updated to:
- Use latest versions of dependencies to resolve deprecated package warnings
- Configure ESLint to ignore during builds (warnings won't fail the build)
- Optimize webpack chunk splitting for better performance
- Skip static generation for dynamic pages

## Common Build Issues and Solutions

### 1. Missing Environment Variables
**Error**: Build fails with missing environment variable errors
**Solution**: Ensure all required environment variables are configured in Vercel settings

### 2. Deprecated Package Warnings
**Error**: Build warnings about deprecated packages
**Solution**: Dependencies have been updated to latest stable versions

### 3. TypeScript Compilation Errors
**Error**: TypeScript compilation fails
**Solution**: Run `npm run build` locally to identify and fix any TypeScript issues

### 4. Node.js Version Issues
**Error**: Build fails due to Node.js version incompatibility
**Solution**: Ensure Vercel is using Node.js 18+ (configure in project settings)

## Testing Before Deployment

1. Run `npm install` to update dependencies
2. Run `npm run build` to ensure the build succeeds locally
3. Run `npm run lint` to check for any linting issues
4. Test the application locally with `npm run dev`

## Deployment Commands

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

## Post-Deployment Verification

After deployment, verify:
- All pages load correctly
- Stripe checkout works
- Email notifications function
- Supabase connections are working
- File uploads work properly

## Support

If you encounter issues:
1. Check Vercel deployment logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your Supabase and Stripe accounts are properly configured
4. Check the browser console for client-side errors