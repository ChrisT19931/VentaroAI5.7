'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';
import { Toaster } from 'react-hot-toast';

// Animated border component with optimized animation timing
function AnimatedBorder() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-gradientX" style={{ animationDuration: '2s' }}></div>
      
      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-gradientX" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
    </div>
  );
}

export default function Footer() {
  // Add Toaster for notifications
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { subscribed, setSubscribed, isLoaded } = useNewsletterSubscription();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSubscribed(true);
        toast.success('Thank you for subscribing to our newsletter!');
        setEmail('');
      } else {
        throw new Error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-black/80 backdrop-blur-sm border-t border-gray-800 mt-20">
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
      <AnimatedBorder />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Ventaro AI */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-blue-400 mr-2">Ventaro</span> AI
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Pioneering the future of digital products with cutting-edge AI technology.
            </p>
            <a 
              href="https://www.linkedin.com/in/christ111" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 inline-flex items-center"
            >
              <span className="mr-2">Follow us on LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {[
                { name: 'FAQ', href: '/faq' },
                { name: 'Terms & Conditions', href: '/terms' },
                { name: 'Refund Policy', href: '/terms#refund-policy' },
                { name: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* AI Products */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">AI Products</h3>
            <ul className="space-y-2">
              {[
                { name: 'AI Tools Mastery Guide 2025', href: '/products/1' },
                { name: 'AI Prompts Arsenal 2025', href: '/products/2' },
                { name: 'AI Web Creation Masterclass', href: '/products/ai-web-creation-masterclass' },
                { name: 'All Products', href: '/products' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        {isLoaded && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-400 mb-6 text-center text-sm">
                Stay updated with our latest AI tools, tutorials, and exclusive offers.
              </p>
              
              {subscribed ? (
                <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 text-center">
                  <p className="text-blue-300 font-medium">Thank you for subscribing!</p>
                  <p className="text-gray-400 text-sm mt-2">You'll receive our next newsletter soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
              
              <p className="text-gray-500 text-xs mt-4 text-center">
                By subscribing, you agree to our <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a> and consent to receive updates from Ventaro AI.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Ventaro AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}