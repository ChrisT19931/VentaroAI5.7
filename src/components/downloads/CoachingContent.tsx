'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'react-hot-toast';
import CoachingCalendar from '@/components/CoachingCalendar';

export default function CoachingContent() {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  useEffect(() => {
    // Simple access check - admin or authenticated user
    if (isAdmin && user?.email === 'chris.t@ventarosales.com') {
      setHasAccess(true);
    } else if (user) {
      setHasAccess(true); // Simplified - assume access if logged in
    }
    setIsLoading(false);
  }, [user, isAdmin]);

  const handleBookingComplete = (bookingId: string) => {
    toast.success('🔥 Booking request submitted successfully!');
    // Could add additional logic here if needed
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-4">1-on-1 AI Coaching Sessions</h1>
            <p className="text-gray-300 mb-8">
              Get personalized AI coaching to accelerate your business growth and income.
            </p>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm mb-2">🔒 Access Required</p>
              <p className="text-gray-300 text-sm">Please log in or purchase to access this content</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/products/3" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Purchase
              </Link>
            </div>
            
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

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-4">1-on-1 AI Coaching Sessions</h1>
          <p className="text-xl text-gray-300">
            Personalized coaching to accelerate your AI-powered business success
          </p>
        </div>

        {/* Booking Section */}
        <div className="mb-8">
          <CoachingCalendar onBookingComplete={handleBookingComplete} />
        </div>



        {/* Session Details */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Session Details</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">⏰</div>
              <h3 className="text-white font-semibold mb-2">Duration</h3>
              <p className="text-gray-300">60 minutes of focused, personalized coaching</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">💻</div>
              <h3 className="text-white font-semibold mb-2">Format</h3>
              <p className="text-gray-300">Video call via Google Meet with screen sharing</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">📋</div>
              <h3 className="text-white font-semibold mb-2">Follow-up</h3>
              <p className="text-gray-300">Follow up email with report</p>
            </div>
          </div>
        </div>

        {/* Preparation Tips */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Prepare</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Define Your Goals</h3>
                <p className="text-gray-300">Come prepared with specific business goals and challenges you want to address.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Gather Your Data</h3>
                <p className="text-gray-300">Bring current metrics, tools you're using, and any specific questions.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Be Ready to Take Action</h3>
                <p className="text-gray-300">Come with a mindset to implement strategies and make changes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <div className="flex gap-4 justify-center">
            <Link 
              href="/my-account" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← Back to Account
            </Link>
            <Link 
              href="/downloads" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View All Downloads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}