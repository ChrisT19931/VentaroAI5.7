'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UnifiedCheckoutButton from '@/components/UnifiedCheckoutButton';

// Helper function to check if user owns a product
function checkOwnership(userProducts: string[], productId: string): boolean {
  return userProducts.includes(productId);
}

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  view_url: string;
  price: number;
  productType: 'digital' | 'physical';
}

const AVAILABLE_PRODUCTS: Product[] = [
  {
    id: 'ai-business-video-guide-2025',
    name: 'AI Web Creation Masterclass',
    description: 'Complete step-by-step video guide to creating AI-powered websites',
    image_url: '/images/products/ai-business-video-guide.svg',
    view_url: '/content/ai-web-creation-masterclass',
    price: 50,
    productType: 'digital'
  },
  {
    id: 'weekly-support-contract-2025',
    name: 'Premium Support Package',
    description: 'One month of premium email support for your AI projects',
    image_url: '/images/products/weekly-support.svg',
    view_url: '/content/support-package',
    price: 300,
    productType: 'digital'
  },
  {
    id: 'ai-prompts-arsenal-2025',
    name: 'AI Prompts Arsenal',
    description: '30 proven AI prompts for building online businesses',
    image_url: '/images/products/ai-prompts-arsenal.svg',
    view_url: '/content/ai-prompts-arsenal',
    price: 10,
    productType: 'digital'
  },
  {
    id: 'ai-tools-mastery-guide-2025',
    name: 'AI Tools Mastery Guide',
    description: 'Complete guide to mastering AI tools for business',
    image_url: '/images/products/ai-tools-mastery-guide.svg',
    view_url: '/content/ai-tools-mastery-guide',
    price: 25,
    productType: 'digital'
  }
];

export default function MyAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ownedProducts, setOwnedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mockUser, setMockUser] = useState<{email: string, isAdmin: boolean} | null>(null);

  // Check URL for email parameter (for demo purposes)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
      const isAdmin = emailParam === 'chris.t@ventarosales.com';
      setMockUser({
        email: emailParam,
        isAdmin
      });
      console.log('Using mock user from URL:', emailParam, 'isAdmin:', isAdmin);
    }
  }, []);

  // Get user from session or mock user
  const user = session?.user || mockUser || null;
  const isAuthenticated = status === 'authenticated' || !!mockUser;

  useEffect(() => {
    console.log('MyAccountPage - Session status:', status);
    console.log('MyAccountPage - User data:', user);
    
    // If still loading and no mock user, wait
    if (status === 'loading' && !mockUser) {
      console.log('MyAccountPage - Session loading, waiting...');
      return;
    }
    
    // If not authenticated and no mock user, redirect to signin
    if (!isAuthenticated) {
      console.log('MyAccountPage - Not authenticated, redirecting to signin');
      router.push(`/signin?callbackUrl=/my-account&t=${Date.now()}`);
      return;
    }
    
    console.log('MyAccountPage - User authenticated successfully');

    const fetchOwnedProducts = async () => {
      try {
        // Check if user is admin (chris.t@ventarosales.com)
        const isAdmin = user?.email === 'chris.t@ventarosales.com' || (mockUser?.isAdmin === true);
        
        if (isAdmin) {
          // Admin gets access to all products
          setOwnedProducts(AVAILABLE_PRODUCTS.map(p => p.id));
        } else {
          // For regular users, fetch from API
          try {
            const response = await fetch('/api/user/products');
            if (response.ok) {
              const data = await response.json();
              setOwnedProducts(data.products || []);
            } else {
              console.error('Failed to fetch owned products');
              // No products for regular users unless purchased
              setOwnedProducts([]);
            }
          } catch (error) {
            console.error('Error fetching user products:', error);
            // No products for regular users unless purchased
            setOwnedProducts([]);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in product fetching flow:', error);
        // No products for regular users unless purchased
        setOwnedProducts([]);
        setIsLoading(false);
      }
    };

    fetchOwnedProducts();
  }, [isAuthenticated, user, router]);

  const isProductOwned = (productId: string) => ownedProducts.includes(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 mb-8 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">My Account</h1>
              <p className="text-gray-300">{user?.email}</p>
              {user?.email === 'chris.t@ventarosales.com' && (
                <span className="inline-block mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  Admin Access
                </span>
              )}
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition-colors font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">My Products</h2>
          <div className="grid gap-6">
            {AVAILABLE_PRODUCTS.map((product) => {
              const owned = isProductOwned(product.id);
              const isAdmin = user?.email === 'chris.t@ventarosales.com';
              const badge = (owned || isAdmin) ? (
                <span className="bg-green-600/90 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">{isAdmin ? 'Admin' : 'Owned'}</span>
              ) : (
                <span className="bg-gray-600/80 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">Locked</span>
              );
              return (
                <div key={product.id} className="bg-gray-900/40 rounded-xl p-6 border border-gray-700/70">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                        {badge}
                      </div>
                      <p className="text-gray-300 mb-4">{product.description}</p>
                      <div className="flex gap-3">
                        {(owned || isAdmin) ? (
                          <Link 
                            href={product.view_url}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors font-semibold"
                          >
                            Access Content
                          </Link>
                        ) : (
                          <>
                            <UnifiedCheckoutButton
                               product={{
                                 id: product.id,
                                 name: product.name,
                                 price: product.price,
                                 image_url: product.image_url,
                                 productType: product.productType
                               }}
                               className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-colors"
                               variant="buy-now"
                             >
                               Purchase A${product.price}
                             </UnifiedCheckoutButton>
                            <Link 
                              href={`/products/${product.id}`}
                              className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl transition-colors font-semibold"
                            >
                              View Details
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}