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
- [SendGrid account](https://sendgrid.com) (optional)

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

## 📋 Current Products

1. **Premium AI E-book** - $99.99
   - 200-page comprehensive guide
   - Advanced ChatGPT techniques
   - Business automation strategies

2. **30 Premium AI Prompts** - $10.00 (ON SALE)
   - Battle-tested prompts
   - Content creation, business strategy, creative projects
   - Copy-paste ready with instructions

3. **1-on-1 AI Mastery Coaching** - $300.00
   - 60-minute personalized session
   - Expert guidance and strategy
   - Contact for scheduling

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

MIT