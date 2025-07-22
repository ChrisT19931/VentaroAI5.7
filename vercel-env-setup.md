# Vercel Environment Variables Setup for Stripe Integration

## Required Environment Variables for Vercel

To ensure smooth Stripe payments, configure these environment variables in your Vercel dashboard:

### 1. Stripe Configuration (REQUIRED)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Supabase Configuration (REQUIRED)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Site Configuration (REQUIRED)
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 4. Email Configuration (OPTIONAL)
```
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
EMAIL_FROM=support@yourdomain.com
```

## Vercel Setup Steps

### Step 1: Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Import the project
3. Configure environment variables (see above)
4. Deploy

### Step 2: Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` in Vercel

### Step 3: Test Payment Flow
1. Visit your deployed site
2. Add products to cart
3. Proceed to checkout
4. Complete test payment
5. Verify webhook delivery in Stripe dashboard

## Environment Variable Validation

The application includes automatic validation for:
- ✅ Stripe publishable key (client-side)
- ✅ Stripe secret key (server-side)
- ✅ Stripe webhook secret (server-side)
- ✅ Supabase configuration

## Troubleshooting

### Common Issues:

1. **"Payment system configuration error"**
   - Check that all Stripe environment variables are set in Vercel
   - Ensure no typos in variable names
   - Verify keys are for the correct Stripe account (test vs live)

2. **"Stripe initialization failed"**
   - Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
   - Check browser console for detailed error messages
   - Ensure the key starts with `pk_`

3. **Webhook not receiving events**
   - Verify webhook URL is correct: `https://your-domain.vercel.app/api/webhook`
   - Check that `STRIPE_WEBHOOK_SECRET` matches the webhook secret in Stripe
   - Ensure webhook is enabled and events are selected

### Debug Commands:

Run locally to test configuration:
```bash
npm run dev
# Check console for environment validation messages
```

### Production Checklist:

- [ ] All environment variables configured in Vercel
- [ ] Stripe webhook configured with production URL
- [ ] Test payment completed successfully
- [ ] Email notifications working (if configured)
- [ ] Download links accessible after payment
- [ ] Webhook events being received and processed

## Security Notes

- Never commit real API keys to version control
- Use test keys for development, live keys for production
- Regularly rotate your API keys
- Monitor Stripe dashboard for unusual activity
- Keep webhook secrets secure