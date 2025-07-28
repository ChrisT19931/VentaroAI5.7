'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'react-hot-toast';
import DownloadPrompts from '@/components/downloads/DownloadPrompts';
import DownloadEbook from '@/components/downloads/DownloadEbook';
import DownloadCoaching from '@/components/downloads/DownloadCoaching';

export default function DynamicDownloadPage() {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productInfo, setProductInfo] = useState({
    name: '',
    fileName: '',
    fileSize: ''
  });
  
  const isAdmin = searchParams.get('admin') === 'true';

  useEffect(() => {
    if (!params.id) {
      router.push('/not-found');
      return;
    }

    const productIdString = Array.isArray(params.id) ? params.id[0] : params.id;
    
    // Set product info
    setProductInfo(getProductInfo(productIdString));
    
    // Check if user is authenticated
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Admin check
    const isRealAdmin = user?.email === 'chris.t@ventarosales.com';
    
    // Fetch user's purchases to determine access to this specific product
    const fetchUserPurchases = async () => {
      // Admin always has access
      if (isRealAdmin) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/purchases/confirm?userId=${user.id}`);
        
        if (response.ok) {
          const data = await response.json();
          const userPurchases = data.purchases || [];
          
          // Check if user has purchased this specific product
          const hasProductAccess = userPurchases.some(
            (purchase: any) => purchase.product_id === productIdString && purchase.status === 'completed'
          );
          
          setHasAccess(hasProductAccess);
        } else {
          console.error('Failed to fetch user purchases');
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error fetching user purchases:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPurchases();
  }, [user, params.id, router]);

  const handleDownload = () => {
    if (!hasAccess) {
      toast.error('Please log in to download this product.');
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
  const getProductInfo = (id: string) => {
    const productMap: Record<string, { name: string; fileName: string; fileSize: string }> = {
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

  // Render appropriate download component based on product ID
  const renderDownloadComponent = () => {
    const productIdString = Array.isArray(params.id) ? params.id[0] : params.id;
    switch(productIdString) {
      case '1':
        return <DownloadEbook productInfo={productInfo} handleDownload={handleDownload} />;
      case '2':
        return <DownloadPrompts productInfo={productInfo} handleDownload={handleDownload} />;
      case '3':
        return <DownloadCoaching productInfo={productInfo} />;
      default:
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">❓</div>
            <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
            <p className="text-gray-300 mb-6">The requested product could not be found.</p>
            <Link 
              href="/products" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        );
    }
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
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4">{productInfo.name}</h1>
            <p className="text-gray-300 mb-8">
              Please log in or purchase to access this product.
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
                href={`/products/${Array.isArray(params.id) ? params.id[0] : params.id}`} 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Purchase
              </Link>
            </div>
            
            <div className="text-sm text-gray-400 mt-6">
              <Link href="/" className="text-blue-400 hover:text-blue-300">
                ← Return to Home
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
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold text-white mb-2">{productInfo.name}</h1>
            <p className="text-gray-300">Thank you for your purchase! Your content is ready for download.</p>
          </div>

          {renderDownloadComponent()}

          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-white mb-3">📋 Important Notes</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                You have lifetime access to this product
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                You can re-download from your account anytime
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                For technical support, contact support@ventaroai.com
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                File format: PDF (compatible with all devices)
              </li>
            </ul>
          </div>

          <div className="text-center mt-8">
            <div className="flex gap-4 justify-center">
              <Link 
                href="/my-account" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ← Back to Account
              </Link>
              <Link 
                href="/products" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse More Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}