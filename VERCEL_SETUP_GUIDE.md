# Vercel Environment Variables Setup Guide

This guide will help you configure all the necessary environment variables in Vercel to fix the authentication system and get your Digital Store working properly.

## 🚨 Current Issue

The application is showing "Invalid API key" errors because the environment variables contain placeholder values instead of real credentials. You need to configure the actual values in your Vercel dashboard.

## 📋 Required Environment Variables

### 1. Supabase Configuration (CRITICAL)

These are required for authentication to work:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get these values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Project API keys → anon/public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Project API keys → service_role → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Stripe Configuration (REQUIRED)

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**How to get these values:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers → API keys
3. Copy the Publishable key and Secret key
4. For webhook secret: Go to Developers → Webhooks → Add endpoint → Copy signing secret

### 3. Site Configuration (REQUIRED)

```
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

Replace `your-app-name` with your actual Vercel app name.

### 4. Email Service (OPTIONAL)

Choose one:

**Option A: SendGrid**
```
SENDGRID_API_KEY=SG.your-api-key
EMAIL_FROM=noreply@yourdomain.com
```

**Option B: Resend**
```
RESEND_API_KEY=re_your-api-key
```

## 🔧 How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: The actual value (e.g., `https://abc123.supabase.co`)
   - **Environment**: Select "Production", "Preview", and "Development"
5. Click "Save"
6. **Important**: Redeploy your application after adding variables

### Method 2: Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all other variables

# Redeploy
vercel --prod
```

## 🚀 Step-by-Step Setup Process

### Step 1: Set Up Supabase
1. Create a Supabase project if you haven't
2. Follow the `SUPABASE_SETUP.md` guide
3. Get your API keys from Supabase dashboard
4. Add them to Vercel environment variables

### Step 2: Set Up Stripe
1. Create Stripe products for your digital store
2. Get your API keys
3. Set up webhook endpoint: `https://your-app.vercel.app/api/webhook`
4. Add Stripe keys to Vercel environment variables

### Step 3: Configure Site URL
1. Add your Vercel app URL to `NEXT_PUBLIC_SITE_URL`
2. Update Supabase redirect URLs to match

### Step 4: Deploy and Test
1. Redeploy your application in Vercel
2. Test user registration
3. Test authentication
4. Test payment flow

## ✅ Verification Checklist

After setting up environment variables:

- [ ] No "Invalid API key" errors on signup/login
- [ ] User registration works
- [ ] User login works
- [ ] Email confirmations are sent (if email service configured)
- [ ] Payment processing works
- [ ] Download access works after purchase

## 🐛 Troubleshooting

### "Invalid API key" Error
- Check that environment variables are set in Vercel
- Verify no placeholder values remain
- Ensure you've redeployed after adding variables

### "Missing environment variable" Error
- Double-check variable names (case-sensitive)
- Ensure variables are set for all environments (Production, Preview, Development)

### Authentication Not Working
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Ensure redirect URLs are configured in Supabase

### Payments Not Working
- Verify Stripe keys are for the correct account (test vs live)
- Check webhook endpoint is configured correctly
- Ensure webhook secret matches

## 📞 Support

If you need help with the setup:
1. Check the error messages in Vercel function logs
2. Verify all environment variables are set correctly
3. Contact: chris.t@ventarosales.com

## 🔒 Security Notes

- Never commit real API keys to your repository
- Use test keys for development, live keys for production
- Regularly rotate your API keys
- Monitor your Stripe and Supabase dashboards for unusual activity

---

**Next Steps**: After configuring environment variables, redeploy your application and test the authentication system.