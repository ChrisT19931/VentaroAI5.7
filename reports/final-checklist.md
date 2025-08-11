# Final Checklist

## Codebase Cleanup

- [ ] No duplicate files/components/APIs
- [ ] All imports resolve correctly
- [ ] Repository builds without TypeScript errors
- [ ] One source of truth for auth config, env loader, Stripe helpers, email helpers, data models/types, and product gating logic

## Environment & Secrets

- [ ] Centralized env access in `lib/env.ts` with runtime validation
- [ ] Proper separation of client-safe and server-only environment variables
- [ ] Verification of all required environment variables
- [ ] Fast failure at boot if required secrets are missing

## Authentication

- [ ] Valid Next.js App Router auth route with GET/POST handlers
- [ ] Session includes user id, email, and purchase entitlements
- [ ] Type safety for Session and User objects

## Payments (Stripe)

- [ ] Products/prices mapped to Stripe Dashboard by price ID
- [ ] Working Checkout Session creation endpoint
- [ ] Webhook handling for checkout.session.completed & payment_intent.succeeded
- [ ] Proper signature verification with STRIPE_WEBHOOK_SECRET
- [ ] Purchase records created with correct user and product information
- [ ] Idempotency with event ID table
- [ ] Logging during local development

## Email (SendGrid)

- [ ] SendGrid wrapped in lib/email.ts
- [ ] Order confirmation emails working
- [ ] Access granted emails working
- [ ] Proper sender email configuration
- [ ] Queue/retry on transient failures

## Data Layer

- [ ] Tables/collections aligned: users, products, purchases, entitlements, webhook_events
- [ ] Idempotent migrations
- [ ] Product seed data matching Stripe price IDs
- [ ] Proper RLS for purchases and read-only products (if using Supabase)

## Access Control

- [ ] Server-side entitlement checks
- [ ] Unauthorized users redirected to paywall or login
- [ ] Helper function for requiring entitlements
- [ ] No client-only protection for premium content

## My Account → Product Lock/Unlock

- [ ] Only purchased products unlock
- [ ] "Go to content" button enabled only with entitlement
- [ ] No cross-product leakage

## Build, Types, and Quality Gates

- [ ] No TypeScript errors
- [ ] No Next.js route type mismatches
- [ ] Health endpoint at /api/health
- [ ] E2E tests for critical flows
- [ ] GitHub Action for typecheck, build, test

## Documentation & Scripts

- [ ] README-OPERATIONS.md with environment variables, local run instructions, etc.
- [ ] scripts/dev-verify.sh for local verification
- [ ] reports/dedupe-summary.md listing deletions/merges and updated import paths
- [ ] reports/final-checklist.md (this file)

## UI/UX Preservation

- [ ] No changes to visual layout
- [ ] No changes to copy
- [ ] No changes to routes
- [ ] No changes to design tokens