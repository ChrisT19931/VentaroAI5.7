# Supabase Database Setup Instructions

## Overview

This guide will help you set up the Supabase database for the Ventaro AI Digital Store. The application requires a `products` table to function properly with real data (though it can also work with mock data for development).

## Setup Instructions

### Option 1: Using the Supabase Dashboard (Recommended)

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to the SQL Editor
4. Create a new query
5. Copy and paste the contents of the `scripts/create-products-table.sql` file into the SQL Editor
6. Run the query

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase db push -f scripts/create-products-table.sql
```

## Verification

After setting up the database, you can verify that everything is working correctly by running:

```bash
npm run deploy-check
```

You should see that the Supabase Connection check passes.

## Troubleshooting

If you encounter any issues:

1. Make sure your Supabase environment variables are correctly set in your `.env.local` file
2. Verify that you have the necessary permissions to create tables in your Supabase project
3. Check the Supabase logs for any errors

## Next Steps

Once your database is set up, you can proceed with deploying your application to Vercel or your preferred hosting provider.