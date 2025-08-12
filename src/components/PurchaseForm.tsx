'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import Spinner from '@/components/ui/Spinner';

interface Product {
  id: string;
  name: string;
  price: number;
  type: 'digital' | 'physical';
  description: string;
  category?: string;
  image_url?: string;
  download_url?: string;
  active?: boolean;
}

// Fallback products if database is unavailable
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'ai-prompt-pack-1',
    name: 'AI Prompt Engineering Masterclass',
    price: 49.99,
    type: 'digital',
    description: 'Complete guide to crafting effective AI prompts',
    category: 'Course'
  },
  {
    id: 'chatgpt-templates',
    name: 'ChatGPT Business Templates',
    price: 29.99,
    type: 'digital',
    description: '50+ ready-to-use ChatGPT templates for business',
    category: 'Templates'
  },
  {
    id: 'ai-automation-course',
    name: 'AI Automation Course',
    price: 99.99,
    type: 'digital',
    description: 'Learn to automate workflows with AI tools',
    category: 'Course'
  }
];

export default function PurchaseForm() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthenticated = status === 'authenticated';
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(6); // Show up to 6 featured products

      if (error) {
        console.error('Error fetching products:', error);
        setProducts(FALLBACK_PRODUCTS);
      } else if (productsData && productsData.length > 0) {
        setProducts(productsData);
      } else {
        // Use fallback if no products in database
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePurchase = async (product: Product) => {
    if (!isAuthenticated || !user) {
      setMessage('Please log in to make a purchase');
      setMessageType('error');
      return;
    }

    setIsProcessing(true);
    setMessage('');
    setSelectedProduct(product);

    try {
      const response = await fetch('/api/purchases/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          productType: product.type,
          customerEmail: user.email,
          customerName: user.name || user.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Purchase successful! Confirmation email sent to ${user.email}`);
        setMessageType('success');
      } else {
        setMessage(data.error || 'Purchase failed');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred during purchase');
      setMessageType('error');
    } finally {
      setIsProcessing(false);
      setSelectedProduct(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
        <p className="text-yellow-300">Please log in to view and purchase products.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Featured Products</h2>
        <p className="text-gray-300">Test the purchase flow with these sample products</p>
      </div>

      {message && (
        <div className={`rounded-lg p-4 ${
          messageType === 'success' 
            ? 'bg-green-900/20 border border-green-500/50' 
            : 'bg-red-900/20 border border-red-500/50'
        }`}>
          <p className={messageType === 'success' ? 'text-green-300' : 'text-red-300'}>
            {message}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 border border-gray-600 rounded-lg p-6 shadow-sm hover:bg-gray-700/50 transition-colors">
              {/* Product Image */}
              {product.image_url && (
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 bg-gray-700">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-400">${product.price?.toFixed(2) || '0.00'}</span>
                <div className="flex gap-2">
                  {product.category && (
                    <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded border border-blue-800/50">
                      {product.category}
                    </span>
                  )}
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {product.type || 'digital'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                 <a
                   href={`/products/${product.id}`}
                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                 >
                   View Details
                 </a>
                 <button
                   onClick={() => handlePurchase(product)}
                   disabled={isProcessing && selectedProduct?.id === product.id}
                   className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                 >
                   {isProcessing && selectedProduct?.id === product.id ? (
                     <>
                       <Spinner size="sm" />
                       <span className="ml-2">Processing...</span>
                     </>
                   ) : (
                     'Buy Now'
                   )}
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}