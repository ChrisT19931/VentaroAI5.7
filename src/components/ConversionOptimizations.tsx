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
  discount?: number;
  onClose?: () => void;
}

export function ExitIntentPopup({ product, discount = 20, onClose }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        analytics.track('exit_intent_popup_shown', {
          product_id: product.id,
          discount: discount
        });
      }
    };

    // Also trigger after 60 seconds if user is still on page
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
        analytics.track('time_based_popup_shown', {
          product_id: product.id,
          discount: discount
        });
      }
    }, 60000);

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShown, product.id, discount]);

  const handleClose = () => {
    setIsVisible(false);
    analytics.track('exit_intent_popup_closed', {
      product_id: product.id
    });
    onClose?.();
  };

  const discountedPrice = product.price * (1 - discount / 100);

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
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Wait! Don't Leave Empty-Handed</h2>
          <p className="text-gray-300 mb-6">
            Get <span className="text-yellow-400 font-bold">{discount}% OFF</span> your first purchase - limited time only!
          </p>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-400 line-through">A${product.price}</div>
                <div className="text-2xl font-bold text-green-400">A${discountedPrice.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">You Save</div>
                <div className="text-lg font-bold text-yellow-400">A${(product.price - discountedPrice).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <UnifiedCheckoutButton
            product={{
              ...product,
              price: discountedPrice
            }}
            buttonText={`🎯 Get ${discount}% OFF Now - A$${discountedPrice.toFixed(2)}`}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl mb-4"
            variant="direct"
          />

          <p className="text-xs text-gray-400">
            This exclusive discount expires when you leave this page
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
  totalCustomers?: number;
}

export function SocialProof({ recentPurchases = [], totalCustomers = 247 }: SocialProofProps) {
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

      {/* Customer Count */}
      <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          <span>{totalCustomers}+ happy customers</span>
        </div>
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

interface ScarcityIndicatorProps {
  stock?: number;
  threshold?: number;
}

export function ScarcityIndicator({ stock = 7, threshold = 10 }: ScarcityIndicatorProps) {
  if (stock > threshold) return null;

  const urgencyLevel = stock <= 3 ? 'high' : stock <= 6 ? 'medium' : 'low';
  const colors = {
    high: 'text-red-400 border-red-500 bg-red-600/20',
    medium: 'text-orange-400 border-orange-500 bg-orange-600/20',
    low: 'text-yellow-400 border-yellow-500 bg-yellow-600/20'
  };

  return (
    <div className={`border rounded-lg p-3 text-center ${colors[urgencyLevel]}`}>
      <div className="font-bold">⚠️ Only {stock} spots left!</div>
      <div className="text-sm opacity-80">Limited availability - secure your spot now</div>
    </div>
  );
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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const testimonial = testimonials[currentIndex];

  return (
    <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-gray-400 text-sm">({testimonial.rating}/5)</span>
      </div>
      
      <blockquote className="text-gray-300 mb-4 italic">
        "{testimonial.text}"
      </blockquote>
      
      <div className="flex items-center">
        {testimonial.image && (
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-semibold text-white">{testimonial.name}</div>
          {testimonial.title && (
            <div className="text-gray-400 text-sm">{testimonial.title}</div>
          )}
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-500' : 'bg-gray-600'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
} 