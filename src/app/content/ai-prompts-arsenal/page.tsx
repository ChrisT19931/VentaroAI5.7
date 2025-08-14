'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Copy, Download, BookOpen, CheckCircle, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AIPromptsArsenalContent() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/signin?callbackUrl=/content/ai-prompts-arsenal');
        return;
      }

      if (!session?.user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        if (session.user.roles?.includes('admin')) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has purchased the product
        const userProducts = session.user.entitlements || [];
        const hasProduct = userProducts.includes('2') || 
                          userProducts.includes('ai-prompts-arsenal-2025') || 
                          userProducts.includes('prompts');

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

  useEffect(() => {
    if (hasAccess) {
      // Load prompts from JSON file
      fetch('/downloads/ai-prompts-arsenal-2025.json')
        .then(res => res.json())
        .then(data => setPrompts(data.prompts || []))
        .catch(err => console.error('Error loading prompts:', err));
    }
  }, [hasAccess]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading prompts...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto text-center">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">🔒 Access Restricted</h1>
          <p className="text-gray-300 mb-6">
            You need to purchase the AI Prompts Arsenal to access this content.
          </p>
          <div className="space-y-4">
            <Link
              href="/products"
              className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white text-base"
            >
              Purchase Access - A$10
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ⚡ AI Prompts Arsenal
            </h1>
            <p className="text-xl text-gray-300">
              30 professional AI prompts for making money online
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">{prompts.length}</h3>
              <p className="text-gray-300">Professional Prompts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">100%</h3>
              <p className="text-gray-300">Copy-Paste Ready</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">5+</h3>
              <p className="text-gray-300">Categories</p>
            </div>
          </div>

          {/* Prompts Grid */}
          <div className="space-y-6">
            {prompts.map((prompt: any, index: number) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {prompt.title || `Prompt ${index + 1}`}
                    </h3>
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {prompt.category || 'General'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(prompt.prompt || prompt.content || '')}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                
                {prompt.description && (
                  <p className="text-gray-300 mb-4">{prompt.description}</p>
                )}
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-gray-200 whitespace-pre-wrap text-sm">
                    {prompt.prompt || prompt.content || 'Prompt content loading...'}
                  </pre>
                </div>
                
                {prompt.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {prompt.tags.map((tag: string, tagIndex: number) => (
                      <span 
                        key={tagIndex}
                        className="bg-purple-600 text-white px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Download Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mt-8 text-center">
            <Download className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Download All Prompts</h3>
            <p className="text-gray-300 mb-6">
              Get the complete collection as a downloadable file for offline use
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              📥 Download JSON File
            </button>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
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