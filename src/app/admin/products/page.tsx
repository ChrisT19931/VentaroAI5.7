'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import Image from 'next/image';

export default function ProductsAdmin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Set isAdmin to true for all users to make admin dashboard accessible to everyone
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/admin/products');
        return;
      }
      
      setUser(session.user);
      fetchProducts();
    };
    
    checkAuth();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const supabase = await createClient();
      
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);
      
      if (error) throw error;
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, is_active: !currentStatus } 
          : product
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spinner size="lg" color="primary" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Product Management</h1>
            <p className="text-gray-300 mt-2">Manage your store's products</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="primary"
              size="md"
              href="/admin/products/new"
            >
              Add New Product
            </Button>
            <Button
              variant="outline"
              size="md"
              href="/admin"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="glass-panel rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">No Products Found</h2>
            <p className="text-gray-400 mb-6">You haven't added any products to your store yet.</p>
            <Button
              variant="primary"
              size="md"
              href="/admin/products/new"
            >
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <div key={product.id} className="glass-panel rounded-lg p-6 flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="w-full md:w-48 h-48 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">{product.name}</h2>
                      <p className="text-gray-400 mb-4">{product.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="text-gray-300">
                      <span className="font-semibold">Price:</span> ${product.price.toFixed(2)}
                    </div>
                    <div className="text-gray-300 ml-4">
                      <span className="font-semibold">ID:</span> {product.id}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      href={`/admin/products/${product.id}`}
                    >
                      Edit Product
                    </Button>
                    <Button
                      variant={product.is_active ? 'danger' : 'success'}
                      size="sm"
                      onClick={() => handleToggleActive(product.id, product.is_active)}
                    >
                      {product.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/products/${product.id}`}
                    >
                      View Product Page
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}