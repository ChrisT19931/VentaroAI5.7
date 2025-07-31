# Vercel Build Fix Guide

This guide addresses the specific build failures you're experiencing on Vercel and provides step-by-step solutions.

## 🚨 Build Issues Identified

1. **Environment Variable Validation Errors**: The app was trying to validate environment variables during build time
2. **Immediate Client Initialization**: Supabase and Stripe clients were being created during module loading
3. **Missing Build-Time Fallbacks**: No graceful handling for missing environment variables during build

## ✅ Fixes Applied

### 1. Next.js Configuration (`next.config.js`)

```javascript
// Added environment variables configuration for Vercel
env: {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
},

// Added build-time environment variable handling
webpack: (config, { isServer }) => {
  config.plugins.push(
    new config.webpack.DefinePlugin({
      'process.env.VERCEL_BUILD': JSON.stringify(process.env.VERCEL || 'false'),
    })
  );
  return config;
},
```

### 2. Supabase Client Fix (`src/lib/supabase.ts`)

- **Changed from immediate initialization to lazy loading**
- **Added build-time validation bypass**
- **Added mock client fallback for build time**

```javascript
// Before: Immediate initialization (caused build failures)
export const supabase = createSupabaseClient(...);

// After: Lazy loading with build-time safety
export const getSupabaseClient = () => {
  // Build-time fallback
  if (process.env.VERCEL_BUILD === 'true') {
    return createSupabaseClient('https://placeholder.supabase.co', 'placeholder-key');
  }
  // Runtime initialization
};
```

### 3. Stripe Client Fix (`src/lib/stripe.ts`)

- **Changed from immediate initialization to lazy loading**
- **Added build-time mock instance**
- **Improved error handling**

```javascript
// Before: Immediate initialization (caused build failures)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// After: Lazy loading with build-time safety
export const getStripeInstance = (): Stripe => {
  if (process.env.VERCEL_BUILD === 'true') {
    return new Stripe('sk_test_placeholder_for_build', config);
  }
  // Runtime initialization
};
```

## 🔧 Required Vercel Environment Variables

Set these in your Vercel dashboard (Settings → Environment Variables):

### Required for All Environments
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)
STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### Email Service (Choose One)
```
# SendGrid
SENDGRID_API_KEY=SG.your-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# OR Resend
RESEND_API_KEY=re_your-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Optional
```
ADMIN_EMAIL=admin@yourdomain.com
EMAIL_FROM=noreply@yourdomain.com
```

## 📋 Step-by-Step Deployment Checklist

### 1. Set Environment Variables in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add all required variables listed above
5. Make sure to set them for **Production**, **Preview**, and **Development** environments

### 2. Update Your Domain URLs
1. Replace `NEXT_PUBLIC_SITE_URL` with your actual Vercel domain
2. Update `NEXT_PUBLIC_BASE_URL` to match
3. Update Stripe webhook URL to: `https://your-domain.vercel.app/api/webhook`
4. Update Supabase redirect URLs in your Supabase dashboard

### 3. Verify API Keys
1. **Supabase**: Get from [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API
2. **Stripe**: Get from [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys
3. **SendGrid**: Get from [SendGrid Dashboard](https://app.sendgrid.com) → Settings → API Keys

### 4. Deploy and Test
1. Trigger a new deployment in Vercel
2. Check build logs for any remaining errors
3. Test the deployed application
4. Verify all features work (auth, payments, emails)

## 🐛 Common Build Error Solutions

### Error: "Missing environment variable"
**Solution**: Ensure all required variables are set in Vercel dashboard and redeploy

### Error: "Supabase configuration error"
**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Error: "Stripe initialization failed"
**Solution**: Verify `STRIPE_SECRET_KEY` is set and starts with `sk_live_` or `sk_test_`

### Error: "Module not found" or "Cannot resolve"
**Solution**: Clear Vercel build cache and redeploy

### Error: TypeScript compilation errors
**Solution**: Run `npm run build` locally to identify and fix TypeScript issues

## 🔍 Verification Commands

Run these locally before deploying:

```bash
# Install dependencies
npm install

# Verify environment configuration
npm run verify-env

# Test build locally
npm run build

# Check for linting issues
npm run lint
```

## 📞 Support

If you continue to experience build issues:
1. Check Vercel function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure your API keys are valid and not placeholder values
4. Contact: chris.t@ventarosales.com

---

**Note**: These fixes ensure your application builds successfully on Vercel while maintaining full functionality in production with proper environment variables configured.