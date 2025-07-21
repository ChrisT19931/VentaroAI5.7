# AI Digital Product Store

A full-stack e-commerce platform for selling AI digital products with one-time payments.

## Features

- Landing page with featured products
- Product catalog and detailed product pages
- User authentication (signup/login)
- Shopping cart functionality
- Secure checkout with Stripe
- Digital product delivery
- Order history
- Email receipts
- Admin panel for product/order/user management

## Tech Stack

- **Frontend**: React + Next.js (App Router) + Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe Checkout (one-time payment)
- **Email**: SendGrid for transactional emails
- **Storage**: Supabase Storage for digital product files
- **Deployment**: Vercel (Next.js optimized)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- SendGrid account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-digital-product-store.git
cd ai-digital-product-store
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual credentials.

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy

## Database Setup

The application uses Supabase for database, authentication, and storage. Follow these steps to set up your database:

1. Create a new project in Supabase
2. Run the SQL scripts in the `supabase/migrations` directory to set up your tables
3. Configure authentication providers in the Supabase dashboard
4. Create storage buckets for product files

## License

MIT