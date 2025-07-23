'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import DownloadPrompts from '@/components/downloads/DownloadPrompts';
import DownloadEbook from '@/components/downloads/DownloadEbook';
import DownloadCoaching from '@/components/downloads/DownloadCoaching';

export default function DynamicDownloadPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [productInfo, setProductInfo] = useState({
    name: '',
    fileName: '',
    fileSize: ''
  });
  
  // Get email and token from URL parameters
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyAccess = async () => {
      if (!params.id) {
        router.push('/not-found');
        return;
      }

      // If no email or token, redirect to product page to purchase
      if (!email || !token) {
        router.push(`/products/${params.id}`);
        return;
      }

      try {
        // Check if user has purchased the product using email and token
        const response = await fetch('/api/verify-download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guestEmail: email,
            orderToken: token,
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
  }, [email, token, router, params.id]);

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
    switch(params.id) {
      case '1':
        return <DownloadEbook productInfo={productInfo} handleDownload={handleDownload} />;
      case '2':
        return <DownloadPrompts productInfo={productInfo} handleDownload={handleDownload} />;
      case '3':
        return <DownloadCoaching productInfo={productInfo} email={email} />;
      default:
        return null;
    }
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
              <Link href="/" className="text-blue-400 hover:text-blue-300">
                Return to Home
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

          {renderDownloadComponent()}

          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-white mb-3">📋 Important Notes</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• This download link is valid for the email used during purchase only</li>
              <li>• You can re-download this file anytime using the link in your confirmation email</li>
              <li>• For technical support, contact support@ventaroai.com</li>
              <li>• File format: PDF (compatible with all devices)</li>
            </ul>
          </div>

          <div className="text-center mt-8">
            <Link href="/products" className="text-blue-400 hover:text-blue-300">
              Browse More Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}