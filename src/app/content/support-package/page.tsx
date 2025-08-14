'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Clock, CheckCircle, Lock, Mail, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import ConsultationCalendar from '@/components/ConsultationCalendar';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading support package...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Premium Support Package</h1>
          <p className="text-gray-300 mb-6">
            This content is available to Support Package customers only.
          </p>
          <div className="space-y-4">
            <Link 
              href="/products/support-package" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Get Support Package
            </Link>
            <div className="text-sm text-gray-400">
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

          {/* Book Consultation Calendar */}
          <div className="mb-8">
            <ConsultationCalendar />
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
            </div>
          </div>

          {/* Support Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Priority Response</h3>
              <p className="text-gray-300">Get responses within 24 hours on business days</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Expert Guidance</h3>
              <p className="text-gray-300">Direct access to AI implementation specialists</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Custom Solutions</h3>
              <p className="text-gray-300">Tailored advice for your specific business needs</p>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link href="/my-account" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 