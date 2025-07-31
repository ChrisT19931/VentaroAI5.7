'use client';

import { useState, useEffect } from 'react';

export function useNewsletterSubscription() {
  const [subscribed, setSubscribed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load subscription status from localStorage on component mount
  useEffect(() => {
    const savedSubscriptionStatus = localStorage.getItem('newsletter_subscribed');
    if (savedSubscriptionStatus === 'true') {
      setSubscribed(true);
    }
    setIsLoaded(true);
  }, []);

  // Save subscription status to localStorage when it changes
  const setSubscribedStatus = (status: boolean) => {
    setSubscribed(status);
    if (typeof window !== 'undefined') {
      localStorage.setItem('newsletter_subscribed', status.toString());
    }
  };

  return { subscribed, setSubscribed: setSubscribedStatus, isLoaded };
}