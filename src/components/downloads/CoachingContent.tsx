'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import toast from 'react-hot-toast';
import CoachingCalendar from '@/components/CoachingCalendar';

export default function CoachingContent() {
  const { user } = useSimpleAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const guestEmail = searchParams.get('email');
  const orderToken = searchParams.get('token');
  const isAdmin = searchParams.get('admin') === 'true';
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);


  useEffect(() => {
    const verifyAccess = async () => {
      // If admin access, check if user is authenticated admin
      if (isAdmin) {
        if (!user) {
          router.push('/login?redirect=/downloads/coaching?admin=true');
          return;
        }
        
        try {
          const response = await fetch('/api/verify-vip-access');
          const data = await response.json();
          
          if (data.hasVipAccess && data.isAdmin) {
            setHasAccess(true);
          } else {
            toast.error('Admin access required.');
            router.push('/my-account');
            return;
          }
        } catch (error) {
          console.error('Error verifying admin access:', error);
          toast.error('Error verifying admin access.');
          router.push('/my-account');
          return;
        } finally {
          setIsVerifying(false);
        }
        return;
      }

      // If no user and no guest email, redirect to login
      if (!user && !guestEmail) {
        router.push('/login?redirect=/downloads/coaching');
        return;
      }

      try {
        // Check if user has purchased the coaching call
        const response = await fetch('/api/verify-download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            guestEmail: guestEmail,
            productType: 'coaching',
            orderToken: orderToken
          })
        });

        const data = await response.json();
        setHasAccess(data.hasAccess);
      } catch (error) {
        console.error('Error verifying access:', error);
        setHasAccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [user, router, guestEmail, orderToken, isAdmin]);



  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="glass-card p-8 text-center">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-3xl font-bold text-white mb-4">1-on-1 Coaching Session</h1>
          <p className="text-gray-300 mb-8">
            Personalized coaching session to help you achieve your business goals.
          </p>
          
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <p className="font-medium text-white">Schedule Coaching Session</p>
                <p className="text-sm text-gray-400">60 minutes • 1-on-1 call</p>
              </div>
              <div className="text-3xl">
                {hasAccess ? '🔓' : '🔒'}
              </div>
            </div>
            
            {hasAccess ? (
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-300 text-sm mb-2">✅ Access Granted</p>
                  <p className="text-gray-300 text-sm">You can now schedule your coaching session</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 text-sm mb-2">🔒 This content is locked</p>
                  <p className="text-gray-300 text-sm">Purchase required to access coaching session</p>
                </div>
                <Link 
                  href="/products/3" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
                >
                  Purchase for $97.00
                </Link>
              </div>
            )}
          </div>
          
          {/* Calendar Booking System */}
          {hasAccess && (
            <div className="mt-8">
              <CoachingCalendar 
                onBookingComplete={(bookingId) => {
                  toast.success('Booking request submitted successfully!');
                }}
              />
            </div>
          )}
          
          <div className="text-sm text-gray-400 mt-6">
            <Link href="/my-account" className="text-blue-400 hover:text-blue-300">
              ← Back to My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}