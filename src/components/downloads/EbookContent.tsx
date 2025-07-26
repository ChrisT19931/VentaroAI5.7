'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'react-hot-toast';

export default function EbookContent() {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const searchParams = useSearchParams();
  const guestEmail = searchParams.get('email');
  const orderToken = searchParams.get('token');
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const isAdmin = searchParams.get('admin') === 'true';

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Check if we have guest access parameters
        const hasGuestParams = sessionId && orderToken;
        
        // If no user and no guest params, redirect to login
        if (!user && !hasGuestParams) {
          router.push('/login?redirect=/downloads/ebook');
          return;
        }

        // Use the verify-vip-access API which handles both admin and user access
        const response = await fetch('/api/verify-vip-access', {
          credentials: 'include'
        });
        const data = await response.json();
        
        // Check if user has access to the ebook (product ID 1)
        let hasEbookAccess = data.isAdmin || data.purchases?.some((purchase: any) => 
          purchase.id === '1' || purchase.id === 1 ||
          purchase.name?.toLowerCase().includes('mastery guide') ||
          purchase.name?.toLowerCase().includes('ebook')
        );
        
        // If no user access but we have guest params, verify guest access
        if (!hasEbookAccess && hasGuestParams) {
          try {
            const guestResponse = await fetch(`/api/verify-download?productType=ebook&session_id=${encodeURIComponent(sessionId!)}&token=${encodeURIComponent(orderToken!)}&order_id=${encodeURIComponent(orderId || '')}`);
            const guestData = await guestResponse.json();
            hasEbookAccess = guestData.hasAccess;
          } catch (guestError) {
            console.error('Guest verification error:', guestError);
          }
        }
        
        setHasAccess(hasEbookAccess);
        
        if (!hasEbookAccess) {
          toast.error('You need to purchase the AI Tools Mastery Guide to access this content.');
        }
      } catch (error) {
        console.error('Error verifying access:', error);
        toast.error('Error verifying access. Please try again.');
        setHasAccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [user, router, sessionId, orderToken, orderId]);

  const handleDownload = () => {
    if (!hasAccess) {
      toast.error('You need to purchase this product first!');
      return;
    }

    setIsDownloading(true);
    
    // Create a download link for the PDF
    const link = document.createElement('a');
    link.href = '/downloads/ai-tools-mastery-guide-2025.pdf';
    link.download = 'AI-Tools-Mastery-Guide-2025-Ventaro.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success toast
    toast.success('🎉 Your AI Tools Mastery Guide download has started!');
    
    setTimeout(() => setIsDownloading(false), 2000);
  };

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

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="glass-card p-8 text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-8">
              You need to purchase the AI Tools Mastery Guide to access this content.
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/products/1" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
              >
                Purchase for $25.00
              </Link>
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
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">📚 AI Tools Mastery Guide 2025</h1>
              <p className="text-gray-300">Your comprehensive guide to making money with AI tools</p>
            </div>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Downloading...
                </>
              ) : (
                <>
                  📥 Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="glass-card p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Key Benefits</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Unlock the power of artificial intelligence to revolutionize your sales process from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 8.25v7.5a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Learn ChatGPT, Claude, Grok, and Gemini</h3>
            </div>

            <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Master AI agents and bots</h3>
            </div>

            <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">30 practical sales lessons</h3>
            </div>

            <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H4.5m2.25 0v3m0 0v.375c0 .621-.504 1.125-1.125 1.125H4.5m2.25 0H3.375c-.621 0-1.125-.504-1.125-1.125V8.25m0 0V7.875c0-.621.504-1.125 1.125-1.125H4.5M6.75 9.75v.75c0 .414-.336.75-.75.75h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H6.75m0 0V9m0 0v-.375c0-.621.504-1.125 1.125-1.125H9m1.5 0H9m0 0v.375c0 .621-.504 1.125-1.125 1.125H6.75M12 9.75v.75c0 .414-.336.75-.75.75h-.75m0 0V9.375c0-.621.504-1.125 1.125-1.125H12m-1.5 0h1.5m0 0V9m0 0h1.125c.621 0 1.125.504 1.125 1.125v.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Revenue generation strategies</h3>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link href="/my-account" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2">
            ← Back to My Account
          </Link>
        </div>
      </div>
    </div>
  );
}