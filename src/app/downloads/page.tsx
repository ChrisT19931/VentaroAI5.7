import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default async function DownloadsPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect unauthenticated users to signin page
  if (!session?.user?.email) {
    redirect('/signin?callbackUrl=/downloads');
  }
  
  const user = session.user;
  const isAdmin = user.roles?.includes('admin') || false;
  let purchases: any[] = [];
  let hasAccess = false;

  // Check if user is admin
  if (user?.email === 'chris.t@ventarosales.com') {
    hasAccess = true;
  } else {
    // For non-admin users, verify purchases
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/purchases/confirm?userId=${encodeURIComponent(user.id)}`);
      
      if (response.ok) {
        const data = await response.json();
        purchases = data.purchases || [];
        
        // Check if user has any purchases
        hasAccess = purchases.length > 0;
      } else {
        console.error('Failed to fetch user purchases');
      }
    } catch (error) {
      console.error('Error fetching user purchases:', error);
    }
  }

  // Create a client component for download functionality
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Downloads
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Access all your purchased digital products here
          </p>
        </div>

        {!hasAccess && (
          <div className="mt-10 text-center">
            <div className="rounded-md bg-yellow-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">No purchases found</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You don't have any purchases yet. Visit our products page to get started.</p>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Browse Products
            </Link>
          </div>
        )}

        {hasAccess && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Map through purchases and display download cards */}
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{purchase.product_name || 'Product'}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Purchased on {new Date(purchase.created_at).toLocaleDateString()}</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <Link 
                    href={`/api/verify-download?productId=${purchase.product_id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Download
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="mt-10">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">Admin access granted. You can access all downloads.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
          return newSet;
        });
      }, 2000);
    }
  };

  const products = [
    {
      id: '1',
      name: 'AI Tools Mastery Guide 2025',
      description: '30-page comprehensive guide with AI tools and prompts to make money online in 2025.',
      fileName: 'ai-tools-mastery-guide-2025.pdf',
      icon: '📚',
      color: 'from-blue-500 to-purple-600',
      viewUrl: '/downloads/ebook'
    },
    {
      id: '2', 
      name: 'AI Prompts Arsenal 2025',
      description: '30 professional AI prompts to build an online business with AI.',
      fileName: 'ai-prompts-collection.pdf',
      icon: '🔥',
      color: 'from-emerald-500 to-green-500',
      viewUrl: '/downloads/prompts'
    },
    {
      id: '3',
      name: 'AI Business Strategy Session',
      description: '60-minute live coaching session to build your online business.',
      fileName: null, // Coaching doesn't have a direct download
      icon: '🎯',
      color: 'from-purple-500 to-pink-500',
      viewUrl: '/downloads/coaching'
    },
    {
      id: '4',
      name: 'AI Business Launch Kit',
      description: 'Build your entire business in hours — not months with this 60-minute video training.',
      fileName: null, // Video doesn't have a direct download
      icon: '🎬',
      color: 'from-purple-500 to-blue-500',
      viewUrl: '/downloads/video'
    },
    {
      id: '6',
      name: 'Custom Website Creation',
      description: 'Professional custom website development service tailored to your business needs.',
      fileName: null, // Custom site doesn't have a direct download
      icon: '💻',
      color: 'from-indigo-500 to-purple-500',
      viewUrl: '/downloads/custom'
    }
  ];

  const bonusProducts = [
    {
      id: 'bonus-1',
      name: 'AI Business Accelerator Checklist',
      description: 'Step-by-step checklist to accelerate your AI business growth.',
      fileName: 'ai-business-accelerator-checklist.pdf',
      icon: '✅',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'bonus-2',
      name: 'AI Niche Finder Worksheet',
      description: 'Find your profitable AI niche with this comprehensive worksheet.',
      fileName: 'ai-niche-finder-worksheet.pdf',
      icon: '🎯',
      color: 'from-teal-500 to-green-500'
    },
    {
      id: 'bonus-3',
      name: 'AI Revenue Tracker Template',
      description: 'Track and optimize your AI business revenue with this Excel template.',
      fileName: 'ai-revenue-tracker-template.xlsx',
      icon: '📊',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your downloads...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Redirecting to login...</p>
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
            <h1 className="text-3xl font-bold text-white mb-4">Access Required</h1>
            <p className="text-gray-300 mb-8">
              Please log in or purchase products to access downloads.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/signin" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/products" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">📥 Your Digital Downloads</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access all your purchased digital products and bonus materials in one place.
          </p>
          {isAdmin && (
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Access - All Products Available
            </div>
          )}
        </div>

        {/* Main Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Main Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const isDownloading = downloadingItems.has(product.id);
              
              return (
                <div
                  key={product.id}
                  id={`product-${product.id}`}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{product.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      href={product.viewUrl}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors block text-center"
                    >
                      📖 View Content
                    </Link>
                    
                    {product.fileName && (
                      <button
                        onClick={() => handleDownload(product.fileName!, product.name, product.id)}
                        disabled={isDownloading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bonus Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">💎 Bonus Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bonusProducts.map((product) => {
              const isDownloading = downloadingItems.has(product.id);
              
              return (
                <div
                  key={product.id}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{product.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(product.fileName || '', product.name, product.id)}
                    disabled={isDownloading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        📥 Download
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4 justify-center">
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
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:chris.t@ventarosales.com" className="text-blue-400 hover:text-blue-300">
                  chris.t@ventarosales.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}