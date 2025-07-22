# Deployment Guide for Ventaro AI Digital Store

This guide covers deploying the Ventaro AI Digital Store to Vercel with all required integrations.

## Prerequisites

- [Vercel account](https://vercel.com)
- [Supabase project](https://supabase.com) (configured with SUPABASE_SETUP.md)
- [Stripe account](https://stripe.com) with products configured
- Email service: [SendGrid](https://sendgrid.com) OR [Resend](https://resend.com)

## 1. Vercel Deployment

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Import the project
3. Configure environment variables (see section below)
4. Deploy

### Environment Variables

In your Vercel dashboard, add these environment variables:

#### Required - Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Required - Stripe
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Required - Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

#### Email Service (Choose One)

**Option A: SendGrid**
```
SENDGRID_API_KEY=SG.your-api-key
EMAIL_FROM=noreply@yourdomain.com
```

**Option B: Resend**
```
RESEND_API_KEY=re_your-api-key
```

## 2. Stripe Configuration

### Webhook Setup
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### Products Setup
Ensure your Stripe products match your Supabase products:
- Product names should include keywords like "E-book", "AI Prompts", "Coaching"
- Prices should match between Stripe and Supabase

## 3. Supabase Configuration

### Database Setup
1. Run all SQL commands from `SUPABASE_SETUP.md`
2. Upload product files to Supabase Storage
3. Configure Row Level Security (RLS) policies

### Storage Setup
1. Create buckets: `product-images`, `product-files`
2. Upload your digital products:
   - `/downloads/ai-tools-mastery-guide-2025.pdf`
   - `/downloads/ai-prompts-collection.pdf`
3. Set appropriate permissions

### Authentication
1. Configure email templates in Supabase Auth
2. Set up your domain for email authentication
3. Configure redirect URLs for production

## 4. Email Service Setup

### SendGrid Setup
1. Verify your sender domain
2. Create API key with full access
3. Configure DNS records for domain verification

### Resend Setup (Alternative)
1. Add and verify your domain
2. Create API key
3. Configure DNS records

## 5. Domain Configuration

### Custom Domain (Optional)
1. Add custom domain in Vercel
2. Configure DNS records
3. Update `NEXT_PUBLIC_SITE_URL` environment variable
4. Update Stripe webhook URL
5. Update Supabase redirect URLs

## 6. Post-Deployment Checklist

### Test Core Functionality
- [ ] User registration and login
- [ ] Product browsing and cart functionality
- [ ] Stripe checkout process
- [ ] Webhook processing (check Vercel function logs)
- [ ] Email delivery (order confirmations)
- [ ] Download access verification
- [ ] Coaching intake form submission

### Test Each Product Type
- [ ] E-book purchase and download
- [ ] AI Prompts purchase and download
- [ ] Coaching call purchase and intake form

### Security Verification
- [ ] Download URLs require authentication
- [ ] Admin routes are protected
- [ ] Environment variables are secure
- [ ] HTTPS is enforced

## 7. Monitoring and Maintenance

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Monitor function execution times and errors

### Error Tracking
- Check Vercel function logs regularly
- Monitor Stripe webhook delivery
- Track email delivery rates

### Database Monitoring
- Monitor Supabase usage and performance
- Regular database backups
- Monitor storage usage

## 8. Troubleshooting

### Common Issues

**Webhook Failures**
- Verify webhook URL is correct
- Check webhook secret matches
- Ensure function timeout is sufficient (30s)

**Email Delivery Issues**
- Verify sender domain is authenticated
- Check API key permissions
- Monitor bounce/spam rates

**Download Access Issues**
- Verify user authentication
- Check order completion status
- Ensure file paths are correct

**Database Connection Issues**
- Verify Supabase credentials
- Check RLS policies
- Monitor connection limits

### Support
For deployment issues, contact: chris.t@ventarosales.com

## 9. Production Optimization

### Performance
- Enable Vercel Edge Functions where applicable
- Optimize images and assets
- Configure proper caching headers

### SEO
- Configure meta tags and Open Graph
- Set up sitemap generation
- Implement structured data

### Security
- Regular security audits
- Keep dependencies updated
- Monitor for vulnerabilities

This deployment guide ensures your Ventaro AI Digital Store is properly configured for production use with all integrations working correctly.