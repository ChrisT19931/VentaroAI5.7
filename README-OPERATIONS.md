# Ventaro AI Digital Store - Operations Guide

## Environment Variables

Copy the `.env.local.example` file to `.env.local` and fill in the required values:

```bash
cp .env.local.example .env.local
```

### Required Environment Variables

#### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (client-safe)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-only)

#### Stripe Configuration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (client-safe)
- `STRIPE_SECRET_KEY`: Your Stripe secret key (server-only)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret (server-only)

#### Email Configuration
- `SENDGRID_API_KEY`: Your SendGrid API key (server-only)
- `EMAIL_FROM`: The email address to send emails from (server-only)

#### Next.js Configuration
- `NEXT_PUBLIC_SITE_URL`: The URL of your site (e.g., http://localhost:3000 for development)
- `NEXTAUTH_URL`: The URL of your site for NextAuth (same as NEXT_PUBLIC_SITE_URL)
- `NEXTAUTH_SECRET`: A random string used to encrypt cookies (generate with `openssl rand -base64 32`)

## Local Development

### Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables as described above.

3. Run the database setup script:

```bash
npm run setup
```

4. Start the development server:

```bash
npm run dev
```

### Stripe Webhook Testing

To test Stripe webhooks locally, you need to use the Stripe CLI to forward events to your local server:

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login to your Stripe account:

```bash
stripe login
```

3. Forward webhook events to your local server:

```bash
stripe listen --forward-to http://localhost:3003/api/webhook/stripe
```

4. The CLI will output a webhook signing secret. Add this to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`.

### Alternative: Using ngrok

If you don't want to use the Stripe CLI, you can use ngrok to expose your local server:

1. Install ngrok: https://ngrok.com/download

2. Start your local server:

```bash
npm run dev
```

3. In a new terminal, start ngrok:

```bash
ngrok http 3003
```

4. Copy the ngrok URL (e.g., https://abc123.ngrok.io)

5. In your Stripe dashboard, go to Developers > Webhooks > Add endpoint and enter the ngrok URL followed by `/api/webhook/stripe`

6. Copy the webhook signing secret and add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`

## Database Seeding

To seed the database with initial product data:

```bash
node scripts/create-products-direct.js
```

Make sure your Stripe product IDs match the ones in your database.

## Deployment (Vercel)

1. Push your code to a GitHub repository.

2. Create a new project in Vercel and link it to your repository.

3. Add all the required environment variables in the Vercel project settings.

4. Deploy the project.

5. Set up the Stripe webhook in your Stripe dashboard to point to your production URL (e.g., https://your-site.vercel.app/api/webhook/stripe).

## Verification

To verify that everything is working correctly, run the dev-verify script:

```bash
./scripts/dev-verify.sh
```

This script will:
1. Run TypeScript type checking
2. Build the project
3. Start the local server
4. Open ngrok to expose the server
5. Start the Stripe webhook listener
6. Create a test checkout session
7. Verify that the entitlement is granted
8. Run smoke tests

## Troubleshooting

### Stripe Webhooks Not Working

- Check that your webhook secret is correct
- Verify that the webhook is properly configured in the Stripe dashboard
- Check the logs for any errors

### Email Not Sending

- Verify your SendGrid API key
- Check that your sender email is verified in SendGrid
- Look for any errors in the logs

### Database Issues

- Check your Supabase credentials
- Verify that the required tables exist
- Run the setup script again if needed

## Maintenance

### Updating Products

When adding or updating products:

1. Update the product in the Stripe dashboard
2. Update the product in your database
3. Update the product mappings in `src/config/products.ts`

### Adding New Features

When adding new features, make sure to:

1. Add proper server-side authentication checks for protected routes
2. Update the types if needed
3. Add tests for the new features
4. Verify that the UI remains unchanged