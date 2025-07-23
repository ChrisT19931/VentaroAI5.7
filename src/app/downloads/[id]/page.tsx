'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';

export default function DynamicDownloadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const toast = useToastContext();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [productInfo, setProductInfo] = useState({
    name: '',
    fileName: '',
    fileSize: ''
  });

  useEffect(() => {
    const verifyAccess = async () => {
      if (!params.id) {
        router.push('/not-found');
        return;
      }

      // If no user, redirect to login
      if (!user) {
        router.push(`/login?redirect=/downloads/${params.id}`);
        return;
      }

      try {
        // Check if user has purchased the product
        const response = await fetch('/api/verify-download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            productId: params.id,
            productType: 'any' // Check any product type
          })
        });

        const data = await response.json();
        
        if (data.hasAccess) {
          // Get product info based on ID
          setProductInfo(getProductInfo(params.id));
          setHasAccess(true);
        } else {
          setHasAccess(false);
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
  }, [user, router, params.id]);

  const handleDownload = () => {
    if (!hasAccess) {
      toast.error('You do not have access to this download.');
      return;
    }
    
    // Create a download link for the file
    const link = document.createElement('a');
    link.href = `/downloads/${productInfo.fileName}`;
    link.download = productInfo.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success toast
    toast.success('Your download has started!');
  };

  // Helper function to get product info based on ID
  const getProductInfo = (id) => {
    const productMap = {
      '1': {
        name: 'AI Tools Mastery Guide 2025',
        fileName: 'ai-tools-mastery-guide-2025.pdf',
        fileSize: '2.5 MB'
      },
      '2': {
        name: 'AI Prompts Arsenal 2025',
        fileName: 'ai-prompts-collection.pdf',
        fileSize: '1.2 MB'
      },
      '3': {
        name: 'AI Business Strategy Session 2025',
        fileName: 'ai-business-strategy-session-2025.pdf',
        fileSize: 'Booking Confirmation'
      }
    };
    
    return productMap[id] || {
      name: 'Unknown Product',
      fileName: 'unknown.pdf',
      fileSize: 'Unknown'
    };
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
              You don&apos;t have access to this download. Please purchase the product first.
            </p>
            <div className="space-y-4">
              <Link href={`/products/${params.id}`} className="btn-primary inline-block">
                Purchase Product
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
            <h1 className="text-3xl font-bold text-white mb-2">{productInfo.name} Download</h1>
            <p className="text-gray-300">Thank you for your purchase! Your content is ready for download.</p>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">📖 Your Purchase</h2>
            <div className="bg-white/10 rounded-lg p-4 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-white">{productInfo.name}</p>
                  <p className="text-sm text-gray-300">{productInfo.fileSize}</p>
                </div>
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <button 
                onClick={handleDownload}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Download Now
              </button>
            </div>
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