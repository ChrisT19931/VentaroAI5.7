'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Users, Star, Zap } from 'lucide-react';
import UnifiedCheckoutButton from './UnifiedCheckoutButton';
import { analytics } from '@/lib/analytics';

interface ExitIntentPopupProps {
  product: {
    id: string;
    name: string;
    price: number;
    productType: 'digital' | 'physical';
  };
  onClose?: () => void;
}

export function ExitIntentPopup({ product, onClose }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        analytics.track('exit_intent_popup_shown', {
          product_id: product.id
        });
      }
    };

    // Also trigger after 60 seconds if user is still on page
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
        analytics.track('time_based_popup_shown', {
          product_id: product.id
        });
      }
    }, 60000);

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShown, product.id]);

  const handleClose = () => {
    setIsVisible(false);
    analytics.track('exit_intent_popup_closed', {
      product_id: product.id
    });
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-md w-full relative border-2 border-purple-500/50 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Don't Miss Out!</h2>
          <p className="text-gray-300 mb-6">
            Transform your business with AI-powered web creation. Get the complete system that builds professional websites in minutes.
          </p>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">A${product.price}</div>
              <div className="text-sm text-gray-400">Complete AI Web Creation System</div>
            </div>
          </div>

          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center text-green-300">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm">Step-by-step video tutorials</span>
            </div>
            <div className="flex items-center text-green-300">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm">AI prompts & templates included</span>
            </div>
            <div className="flex items-center text-green-300">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm">Full deployment guidance</span>
            </div>
            <div className="flex items-center text-green-300">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm">Keep your code forever</span>
            </div>
          </div>

          <UnifiedCheckoutButton
            product={product}
            buttonText={`🚀 Get Started Now - A$${product.price}`}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl mb-4"
            variant="direct"
          />

          <p className="text-xs text-gray-400">
            ⚡ Instant access • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

interface UrgencyTimerProps {
  endTime: Date;
  onExpire?: () => void;
}

export function UrgencyTimer({ endTime, onExpire }: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime.getTime() - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, endTime.getTime() - Date.now());
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (timeLeft === 0) {
    return (
      <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 text-center">
        <div className="text-red-400 font-bold">⏰ OFFER EXPIRED</div>
      </div>
    );
  }

  return (
    <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 text-center animate-pulse">
      <div className="flex items-center justify-center mb-2">
        <Clock className="w-5 h-5 text-red-400 mr-2" />
        <span className="text-red-400 font-bold">LIMITED TIME OFFER</span>
      </div>
      <div className="text-2xl font-black text-red-400">
        {formatTime(timeLeft)}
      </div>
      <div className="text-red-300 text-sm">Offer expires soon!</div>
    </div>
  );
}

interface SocialProofProps {
  recentPurchases?: Array<{
    name: string;
    product: string;
    timeAgo: string;
    location?: string;
  }>;
}

export function SocialProof({ recentPurchases = [] }: SocialProofProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (recentPurchases.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentPurchases.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [recentPurchases.length]);

  const defaultPurchases = [
    { name: 'Sarah M.', product: 'AI Web Creation Masterclass', timeAgo: '2 minutes ago', location: 'Sydney' },
    { name: 'James L.', product: 'Complete AI Bundle', timeAgo: '5 minutes ago', location: 'Melbourne' },
    { name: 'Emma K.', product: 'AI Prompts Arsenal', timeAgo: '8 minutes ago', location: 'Brisbane' },
    { name: 'David R.', product: 'AI Web Creation Masterclass', timeAgo: '12 minutes ago', location: 'Perth' },
    { name: 'Lisa T.', product: 'Support Package', timeAgo: '15 minutes ago', location: 'Adelaide' }
  ];

  const purchases = recentPurchases.length > 0 ? recentPurchases : defaultPurchases;

  return (
    <div className="space-y-4">
      {/* Recent Purchase Notification */}
      <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <div className="flex-1">
            <div className="text-green-300 font-semibold">
              {purchases[currentIndex].name} just purchased {purchases[currentIndex].product}
            </div>
            <div className="text-green-400 text-sm">
              {purchases[currentIndex].timeAgo} • {purchases[currentIndex].location}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Only */}
      <div className="flex items-center justify-center text-gray-400 text-sm">
        <div className="flex items-center">
          <div className="flex -space-x-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="ml-2">4.9/5 rating</span>
        </div>
      </div>
    </div>
  );
}

export function ScarcityIndicator() {
  return null;
}

interface TestimonialCarouselProps {
  testimonials: Array<{
    name: string;
    text: string;
    rating: number;
    image?: string;
    title?: string;
  }>;
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  // Return null to remove testimonials section
  return null;
} 