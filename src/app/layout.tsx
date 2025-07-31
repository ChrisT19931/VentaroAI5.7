import './globals.css'
import '@/styles/cinematic.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'AI-Powered Digital Products - Transform Your Business with AI Tools',
  description: 'Discover AI Tools Mastery Guide 2025, AI Prompts Arsenal 2025, and AI Business Strategy Sessions to make money with AI in 2025. Learn proven strategies to make money online using ChatGPT, Claude, and cutting-edge AI technologies.',
  keywords: 'AI tools, AI prompts, make money online, make money with AI, 2025 AI strategies, ChatGPT prompts, AI business, digital products, online income, AI automation, artificial intelligence tools',
  openGraph: {
    title: 'AI-Powered Digital Products - Transform Your Business with AI Tools',
    description: 'Master AI tools and prompts to make money online in 2025. AI Tools Mastery Guide 2025, AI Prompts Arsenal 2025, and AI Business Strategy Sessions for AI-powered business success.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Digital Products - Transform Your Business with AI Tools',
    description: 'Learn to make money online with AI tools and prompts in 2025',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NNLDTS7ZQP"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NNLDTS7ZQP');
            `,
          }}
        />
        <meta name="google-site-verification" content="zXt_s8PvYsJRPZuS-Lxvv9r1sLkVqbaYfbPl2l64-B4" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <SimpleAuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </SimpleAuthProvider>
      </body>
    </html>
  )
}