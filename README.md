# Ventaro AI Digital Store

A full-stack e-commerce platform for selling AI digital products with one-time payments. Features a modern dark theme design and comprehensive admin panel.

## 🚀 Features

- **Modern Landing Page** with featured products and dark theme
- **Detailed Product Pages** for E-book, AI Prompts, and Coaching
- **User Authentication** (signup/login) with Supabase
- **Shopping Cart** functionality with persistent state
- **Secure Checkout** with Stripe integration
- **Digital Product Delivery** with download links
- **Order History** and email receipts
- **Admin Panel** for product/order/user management
- **Responsive Design** optimized for all devices
- **SEO Optimized** with proper meta tags

## Tech Stack

- **Frontend**: React + Next.js (App Router) + Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe Checkout (one-time payment)
- **Email**: SendGrid for transactional emails
- **Storage**: Supabase Storage for digital product files
- **Deployment**: Vercel (Next.js optimized)

## 🚀 Quick Start
### Prerequisites

- Node.js 18+ and npm
- [Supabase account](https://supabase.com)
- [Stripe account](https://stripe.com)
- Email service: [SendGrid](https://sendgrid.com) OR [Resend](https://resend.com)
- [Vercel account](https://vercel.com) for deployment

### Installation

1. **Clone the repository**

```bash
git clone <your-repository-url>
cd ventaro-ai-digital-store
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase** (IMPORTANT)

   Follow the detailed guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) to:
   - Create your Supabase project
   - Set up database tables and policies
   - Configure authentication
   - Create storage buckets

4. **Configure environment variables**

   Update `.env.local` with your actual credentials from Supabase, Stripe, and SendGrid.

5. **Set up admin user**

```bash
npm run setup
```

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 🔑 Admin Access

- **Email**: Set during setup
- **Password**: Set during signup
- **Admin Panel**: `/admin` (accessible after setup)

### 🚀 Deployment

#### Pre-Deployment Check
```bash
# Validate configuration before deployment
npm run check-config

# Run full deployment check (config + build)
npm run deploy-check
```

#### Deploy to Vercel
1. Follow the complete [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Configure all environment variables in Vercel
3. Set up Stripe webhooks with your production URL
4. Test all functionality after deployment

#### Required Environment Variables
See [.env.local.example](./.env.local.example) for all required variables:

**Critical for Stripe Payments:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with pk_)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with sk_)
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret (starts with whsec_)

**Other Required:**
- Supabase credentials
- Email service API key (SendGrid or Resend)
- Site URL for production

📋 **Quick Setup Guide:** See [vercel-env-setup.md](./vercel-env-setup.md) for detailed Vercel deployment instructions.

## 📋 Current Products

1. **AI Tools Mastery Guide 2025** - $25.00 (50% OFF)
   - 30-page guide with AI tools and AI prompts
   - Learn ChatGPT, Claude, Grok, and Gemini
   - Master AI agents and bots

2. **AI Prompts Arsenal 2025** - $10.00
   - 30 professional AI prompts for making money online
   - Proven ChatGPT and Claude prompts
   - Copy-paste ready for immediate use

3. **AI Business Strategy Session 2025** - $497.00
   - 60-minute live video coaching session
   - Master ChatGPT for business applications
   - Learn Vercel deployment from scratch

## Deployment

The application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy

## 🛠️ Configuration

### Database Setup

**IMPORTANT**: The application requires proper Supabase configuration to work. See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for complete setup instructions.

### Environment Variables

Required variables in `.env.local`:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (Optional - for emails)
SENDGRID_API_KEY=SG.your-api-key
EMAIL_FROM=support@ventaroai.com
```

### Admin Authentication Fix

This version includes fixes for admin authentication:
- ✅ Uses `is_admin` boolean field (not `role`)
- ✅ Proper profile creation with correct schema
- ✅ Fixed user ID mapping in database queries
- ✅ Automated setup script for admin user creation

## 🎯 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run setup    # Set up admin user and sample products
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/          # Admin panel
│   ├── products/       # Product pages
│   ├── api/           # API routes
│   └── ...
├── components/         # Reusable components
├── context/           # React contexts (Auth, Cart, Toast)
├── hooks/             # Custom React hooks
├── lib/               # External service configurations
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## License

MIT# Force deployment Wed Jul 23 11:21:43 AEST 2025
