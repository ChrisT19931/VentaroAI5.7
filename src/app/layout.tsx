import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Ventaro AI Digital Store 2025 - AI Tools Mastery Guide & AI Prompts Arsenal to Make Money Online',
  description: 'Discover AI Tools Mastery Guide 2025, AI Prompts Arsenal 2025, and AI Business Strategy Sessions to make money with AI in 2025. Learn proven strategies to make money online using ChatGPT, Claude, and cutting-edge AI technologies.',
  keywords: 'AI tools, AI prompts, make money online, make money with AI, 2025 AI strategies, ChatGPT prompts, AI business, digital products, online income, AI automation, artificial intelligence tools',
  openGraph: {
    title: 'Ventaro AI Digital Store 2025 - AI Tools & Prompts for Online Income',
    description: 'Master AI tools and prompts to make money online in 2025. AI Tools Mastery Guide 2025, AI Prompts Arsenal 2025, and AI Business Strategy Sessions for AI-powered business success.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ventaro AI Digital Store 2025 - AI Tools & Prompts',
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
      <body className={`${inter.variable} font-sans`}>
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}