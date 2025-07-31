'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  variant?: 'hero' | 'product' | 'compact';
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ variant = 'hero', className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  // Target date: September 1st, 2025 at 12:00 AM
  const targetDate = new Date('2025-09-01T00:00:00').getTime();

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-red-500 font-bold text-lg">
          🔥 Coaching Discount Has Ended
        </div>
      </div>
    );
  }

  // Hero variant - large and prominent
  if (variant === 'hero') {
    return (
      <div className={`text-center ${className}`}>
        <div className="backdrop-blur-xl bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="text-red-400 font-bold text-sm mb-2 uppercase tracking-wider">
            🔥 Limited Time: Coaching Discount Ends In
          </div>
          <div className="flex justify-center items-center space-x-4 text-white">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-b from-white to-red-200 bg-clip-text text-transparent">
                {timeLeft.days}
              </div>
              <div className="text-xs text-red-300 font-semibold uppercase tracking-wide">Days</div>
            </div>
            <div className="text-2xl text-red-400 font-bold">:</div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-b from-white to-red-200 bg-clip-text text-transparent">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-red-300 font-semibold uppercase tracking-wide">Hours</div>
            </div>
            <div className="text-2xl text-red-400 font-bold">:</div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-b from-white to-red-200 bg-clip-text text-transparent">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-red-300 font-semibold uppercase tracking-wide">Mins</div>
            </div>
            <div className="text-2xl text-red-400 font-bold">:</div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-b from-white to-red-200 bg-clip-text text-transparent">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-red-300 font-semibold uppercase tracking-wide">Secs</div>
            </div>
          </div>
          <div className="text-orange-300 text-sm mt-3 font-medium">
            Save $2,500 on Complete Business Deployment Coaching
          </div>
        </div>
      </div>
    );
  }

  // Product variant - medium size for product pages
  if (variant === 'product') {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/20 rounded-xl p-4 mb-4">
          <div className="text-red-400 font-bold text-xs mb-2 uppercase tracking-wider">
            🔥 Coaching Discount Ends In
          </div>
          <div className="flex justify-center items-center space-x-3 text-white">
            <div className="text-center">
              <div className="text-xl font-black text-red-300">{timeLeft.days}</div>
              <div className="text-xs text-red-400 font-medium">Days</div>
            </div>
            <div className="text-red-400">:</div>
            <div className="text-center">
              <div className="text-xl font-black text-red-300">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-xs text-red-400 font-medium">Hrs</div>
            </div>
            <div className="text-red-400">:</div>
            <div className="text-center">
              <div className="text-xl font-black text-red-300">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-xs text-red-400 font-medium">Min</div>
            </div>
            <div className="text-red-400">:</div>
            <div className="text-center">
              <div className="text-xl font-black text-red-300">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-xs text-red-400 font-medium">Sec</div>
            </div>
          </div>
          <div className="text-orange-300 text-xs mt-2">
            Save $2,500 on Coaching
          </div>
        </div>
      </div>
    );
  }

  // Compact variant - small size for previews
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2 text-white text-sm">
            <span className="text-red-400 font-bold">🔥</span>
            <span className="font-bold text-red-300">
              {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}h {timeLeft.minutes.toString().padStart(2, '0')}m
            </span>
            <span className="text-red-400 text-xs">left</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}