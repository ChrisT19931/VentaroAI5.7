# Vercel Shared Environment Variables Setup Guide

## Overview

This guide explains how to properly configure all API keys (Supabase, Stripe, SendGrid, etc.) to use Vercel's shared environment variables. Using Vercel's shared environment variables ensures that your API keys are securely stored and accessible across all deployment environments.

## Current Implementation

The project is already set up to use environment variables for all API keys:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Stripe**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **SendGrid**: `SENDGRID_API_KEY`, `EMAIL_FROM`
- **Resend** (alternative to SendGrid): `RESEND_API_KEY`
- **Site Configuration**: `NEXT_PUBLIC_SITE_URL`

## Setting Up Vercel Shared Environment Variables

### Step 1: Access Vercel Environment Variables

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**

### Step 2: Add Environment Variables

Add all required environment variables from your `.env.local.example` file:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration (Choose one)
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_sender_email@example.com

# Resend Configuration (Alternative to SendGrid)
RESEND_API_KEY=your_resend_api_key

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=https://your-production-url.com
```

### Step 3: Configure Environment Variable Sharing

1. For each environment variable, select the environments where it should be available:
   - **Production**: For your live site
   - **Preview**: For preview deployments (pull requests, etc.)
   - **Development**: For local development

2. For sensitive variables (API keys, secrets), ensure they are only shared with the necessary environments.

3. For public variables (those prefixed with `NEXT_PUBLIC_`), share them with all environments.

### Step 4: Save and Deploy

After configuring all environment variables:

1. Click **Save** to apply your changes
2. Redeploy your application to ensure the new environment variables are used

## Verifying Configuration

To verify that your environment variables are correctly configured:

1. Run the verification script locally:
   ```bash
   npm run verify-env
   ```

2. Deploy your application
3. Check the deployment logs for any environment variable-related errors
4. Test functionality that relies on these services (authentication, payments, emails)
5. Visit the admin dashboard at `/admin/system` to see the status of your API connections

## Troubleshooting

### Common Issues

- **"Missing environment variable" errors**: Ensure all required variables are added to Vercel
- **"Invalid API key" errors**: Check that the API keys are correct and not placeholder values
- **Services not working**: Verify that the environment variables are shared with the correct environments

### Environment Variable Precedence

Vercel uses the following precedence for environment variables:

1. Runtime environment variables (set during deployment)
2. Project environment variables (set in Vercel dashboard)
3. Local `.env.local` file (for local development only)

## Security Best Practices

- Never commit API keys or secrets to your repository
- Use different API keys for development and production
- Regularly rotate your API keys for enhanced security
- Use Vercel's environment variable encryption for sensitive data

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Environment Variables](https://supabase.com/docs/guides/with-nextjs#environment-variables)
- [Stripe Environment Variables](https://stripe.com/docs/development/quickstart#api-keys)