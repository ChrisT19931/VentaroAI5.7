'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function EbookDownloadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!user) {
        router.push('/login?redirect=/downloads/ebook');
        return;
      }

      try {
        // Check if user has purchased the ebook
        const response = await fetch('/api/verify-download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            productType: 'ebook'
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
  }, [user, router]);

  const handleDownload = () => {
    // Create a download link for the PDF
    const link = document.createElement('a');
    link.href = '/assets/downloads/premium-ai-ebook.pdf';
    link.download = 'Premium-AI-Ebook-Ventaro.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="glass-card p-8">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-6">
              You don't have access to this download. Please purchase the Premium AI E-book first.
            </p>
            <div className="space-y-4">
              <Link href="/products/ebook" className="btn-primary inline-block">
                Purchase E-book
              </Link>
              <br />
              <Link href="/account" className="text-blue-400 hover:text-blue-300">
                Check My Purchases
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
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold text-white mb-2">Premium AI E-book Download</h1>
            <p className="text-gray-300">Thank you for your purchase! Your e-book is ready for download.</p>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">📖 What's Included</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>200+ page comprehensive AI business guide (PDF)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>50+ ready-to-use AI prompt templates</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>AI tools comparison spreadsheet</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Bonus materials and case studies</span>
              </li>
            </ul>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleDownload}
              className="btn-primary text-lg px-8 py-4"
            >
              📥 Download E-book (PDF)
            </button>
          </div>

          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-3">📋 Important Notes</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• This download link is valid for your account only</li>
              <li>• You can re-download this file anytime from your account dashboard</li>
              <li>• For technical support, contact support@ventaroai.com</li>
              <li>• File format: PDF (compatible with all devices)</li>
            </ul>
          </div>

          <div className="text-center mt-8">
            <Link href="/account" className="text-blue-400 hover:text-blue-300 mr-6">
              ← Back to My Account
            </Link>
            <Link href="/products" className="text-blue-400 hover:text-blue-300">
              Browse More Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}