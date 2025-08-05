'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'react-hot-toast';

interface PromptsContentProps {
  hasAccess?: boolean;
  isAdmin?: boolean;
}

export default function PromptsContent({ hasAccess = false, isAdmin = false }: PromptsContentProps) {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleDownload = () => {
    if (!hasAccess) {
      toast.error('Please log in to download');
      return;
    }
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/downloads/ai-prompts-collection.pdf';
    link.download = 'AI-Prompts-Collection.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
    setTimeout(() => setIsDownloading(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
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
            <h1 className="text-3xl font-bold text-white mb-4">AI Prompts Collection 2025</h1>
            <p className="text-gray-300 mb-6">Access our premium collection of AI prompts to enhance your productivity and creativity.</p>
            <Link href="/auth/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Login to Access
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI Prompts Collection 2025</h1>
          <p className="text-gray-300 text-lg">Premium prompts for enhanced productivity and creativity</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-white mb-4">Download Your Collection</h2>
            <p className="text-gray-300 mb-6">Get instant access to our curated collection of AI prompts.</p>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">What's Included</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• 100+ Premium AI Prompts</li>
              <li>• Content Creation Templates</li>
              <li>• Business Strategy Prompts</li>
              <li>• Creative Writing Starters</li>
              <li>• Technical Documentation</li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Perfect For</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Content Creators</li>
              <li>• Business Professionals</li>
              <li>• Students & Researchers</li>
              <li>• Writers & Marketers</li>
              <li>• AI Enthusiasts</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link href="/downloads" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            ← Back to Downloads
          </Link>
        </div>
      </div>
    </div>
  );
}