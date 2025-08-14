'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Clock, CheckCircle, Lock, Mail, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function SupportPackageContent() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/signin?callbackUrl=/content/support-package');
        return;
      }

      if (!session?.user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        if (session.user.roles?.includes('admin') || session.user.email === 'chris.t@ventarosales.com') {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has purchased the product
        const userProducts = session.user.entitlements || [];
        const hasProduct = userProducts.includes('support-package') || 
                          userProducts.includes('weekly-support-contract-2025') || 
                          userProducts.includes('support');

        setHasAccess(hasProduct);
        
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [session, status, router]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading support portal...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto text-center">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">🔒 Access Restricted</h1>
          <p className="text-gray-300 mb-6">
            You need to purchase the Premium Support Package to access this content.
          </p>
          <div className="space-y-4">
            <Link
              href="/products"
              className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-base"
            >
              Purchase Access - A$300
            </Link>
            <Link
              href="/my-account"
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full block text-center"
            >
              Back to My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🎯 Premium Support Package
            </h1>
            <p className="text-xl text-gray-300">
              Expert guidance and priority support for your AI projects
            </p>
          </div>

          {/* Book Consultation */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 text-center">
            <Calendar className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Book Your Consultation</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Schedule a personalized 1-on-1 consultation to discuss your AI implementation needs and get expert guidance.
            </p>
            <Link
              href="/contact"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-colors inline-block text-lg"
            >
              📅 Schedule Consultation Call
            </Link>
          </div>



          {/* Contact Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 text-center">
            <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Need Immediate Help?</h2>
            <p className="text-gray-300 mb-6">
              Contact our support team directly for urgent matters or specific questions
            </p>
            <div className="space-y-4">
              <a
                href="mailto:chris.t@ventarosales.com?subject=Support Request - Premium Package"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
              >
                📧 Email Support Team
              </a>
              <p className="text-sm text-gray-400">
                Response time: Within 24 hours | Priority support included
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <Link
              href="/my-account"
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors mr-4"
            >
              ← Back to My Account
            </Link>
            <Link
              href="/content"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View All Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 