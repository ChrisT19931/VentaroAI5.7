'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';

export default function PromptsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToastContext();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const searchParams = useSearchParams();
  const guestEmail = searchParams.get('email');
  const orderToken = searchParams.get('token');

  useEffect(() => {
    const verifyAccess = async () => {
      // If no user and no guest email, redirect to login
      if (!user && !guestEmail) {
        router.push('/login?redirect=/downloads/prompts');
        return;
      }

      try {
        // Check if user has purchased the prompts
        const response = await fetch('/api/verify-download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            guestEmail: guestEmail,
            productType: 'prompts',
            orderToken: orderToken
          })
        });

        const data = await response.json();
        setHasAccess(data.hasAccess);
      } catch (error) {
        console.error('Error verifying access:', error);
        toast.error('Error verifying access. Please try again.');
        setHasAccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [user, router, guestEmail, orderToken]);

  const handleDownload = () => {
    // Create a download link for the PDF
    const link = document.createElement('a');
    link.href = '/downloads/ai-prompts-collection.pdf';
    link.download = 'AI-Prompts-Collection-Ventaro.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success toast
    toast.success('Your download has started!');
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
              You don&apos;t have access to this download. Please purchase the AI Prompts Collection first.
            </p>
            <div className="space-y-4">
              <Link href="/products/2" className="btn-primary inline-block">
              Purchase AI Prompts
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
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Prompts Collection Download</h1>
            <p className="text-gray-300">Thank you for your purchase! Your prompts collection is ready for download.</p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">🎯 What's Included</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-green-400 mb-2">Content Creation (10)</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>• Blog post outlines</li>
                  <li>• Social media content</li>
                  <li>• Email sequences</li>
                  <li>• Video scripts</li>
                  <li>• Product descriptions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Business Strategy (10)</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>• Market research</li>
                  <li>• Business plans</li>
                  <li>• SWOT analysis</li>
                  <li>• Customer personas</li>
                  <li>• Pricing strategies</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-400 mb-2">Creative Projects (10)</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>• Brand naming</li>
                  <li>• Logo concepts</li>
                  <li>• Website copy</li>
                  <li>• Ad copy</li>
                  <li>• Campaign ideas</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">🎁 Bonus Materials</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-yellow-400">⭐</span>
                <span>Prompt customization guide</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-400">⭐</span>
                <span>AI model compatibility chart</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-400">⭐</span>
                <span>Usage instructions and examples</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-yellow-400">⭐</span>
                <span>15 bonus prompts for advanced users</span>
              </li>
            </ul>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleDownload}
              className="btn-primary text-lg px-8 py-4"
            >
              📥 Download Prompts Collection (PDF)
            </button>
          </div>

          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-3">📋 How to Use</h3>
            <ol className="space-y-2 text-gray-300 text-sm">
              <li>1. Copy any prompt from the PDF</li>
              <li>2. Replace [PLACEHOLDERS] with your specific information</li>
              <li>3. Paste into ChatGPT, Claude, or your preferred AI tool</li>
              <li>4. Review and refine the output as needed</li>
              <li>5. Save successful variations for future use</li>
            </ol>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                Compatible with: ChatGPT, Claude, Gemini, Bing Chat, and other major AI platforms
              </p>
            </div>
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