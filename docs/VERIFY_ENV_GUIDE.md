# Environment Variables Verification Guide

## Overview

The `verify-env` script checks if all required API keys (Supabase, Stripe, SendGrid, etc.) are properly configured to use Vercel's shared environment variables. This script helps ensure that your application is correctly set up for deployment to Vercel.

## What the Script Checks

The script verifies the following environment variables:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### Stripe Configuration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

### Email Configuration
- `SENDGRID_API_KEY`: Your SendGrid API key (optional if using Resend)
- `RESEND_API_KEY`: Your Resend API key (optional if using SendGrid)
- `EMAIL_FROM`: The email address used as the sender

### Site Configuration
- `NEXT_PUBLIC_SITE_URL`: Your site's public URL

## How to Run the Script

To verify your environment variables, run the following command:

```bash
npm run verify-env
```

## Understanding the Results

The script will output the status of each environment variable with the following indicators:

- ✓ (Green): The variable is properly configured
- ⚠ (Yellow): The variable contains a placeholder value or is missing (for optional variables)
- ✗ (Red): The variable is missing (for required variables)

### Example Output

```
🔍 Vercel Environment Variables Verification
==================================================

📋 Supabase Configuration:
✓ NEXT_PUBLIC_SUPABASE_URL: Properly configured
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY: Properly configured
✓ SUPABASE_SERVICE_ROLE_KEY: Properly configured

💳 Stripe Configuration:
✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Properly configured
✓ STRIPE_SECRET_KEY: Properly configured
✓ STRIPE_WEBHOOK_SECRET: Properly configured

📧 Email Configuration:
✓ SENDGRID_API_KEY: Properly configured
⚠ RESEND_API_KEY: Missing (Optional)
✓ EMAIL_FROM: Properly configured

🌐 Site Configuration:
✓ NEXT_PUBLIC_SITE_URL: Properly configured

📊 Verification Summary:
✅ All environment variables are properly configured for Vercel deployment!
```

## Troubleshooting

If the script reports issues with your environment variables, follow these steps:

1. Check if the variable is set in your `.env.local` file (for local development)
2. Verify that the variable is set in your Vercel dashboard (for deployment)
3. Ensure the variable doesn't contain placeholder values like `your_` or `placeholder`
4. If using Vercel, make sure the variable is shared with the appropriate environments (Production, Preview, Development)

## Related Documentation

- [VERCEL_ENV_SETUP.md](../VERCEL_ENV_SETUP.md): Detailed guide on setting up environment variables in Vercel
- [.env.local.example](../.env.local.example): Example environment variables file
- [DEPLOYMENT.md](../DEPLOYMENT.md): Complete deployment guide