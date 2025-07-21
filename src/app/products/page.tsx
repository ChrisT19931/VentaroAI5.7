import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';

async function getProducts() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <select 
              className="input-field max-w-xs"
              defaultValue="all"
            >
              <option value="all">All Categories</option>
              <option value="tools">AI Tools</option>
              <option value="templates">Templates</option>
              <option value="courses">Courses</option>
            </select>
          </div>
          <div>
            <select 
              className="input-field max-w-xs"
              defaultValue="newest"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="card group hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {product.image_url ? (
                    <Image 
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Product Image
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-1 capitalize">{product.category || 'Uncategorized'}</div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    <Link href={`/products/${product.id}`} className="btn-outline text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}