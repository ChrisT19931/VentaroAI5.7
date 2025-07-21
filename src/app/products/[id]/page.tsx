import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AddToCartButton from '@/components/AddToCartButton';

async function getProduct(id: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
  
  if (error || !data) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 relative">
              {product.image_url ? (
                <Image 
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Product Image
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2">
            <div className="text-sm text-gray-500 mb-2 capitalize">{product.category || 'Uncategorized'}</div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="text-2xl font-bold text-primary-600 mb-6">${product.price.toFixed(2)}</div>
            
            <div className="prose prose-lg mb-8">
              <p>{product.description}</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What You'll Get:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant digital download after purchase
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full access to the product files
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    One-time payment, no subscription
                  </li>
                </ul>
              </div>
              
              <AddToCartButton product={product} />
              
              <div className="text-sm text-gray-500">
                Secure payment processing by Stripe
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Product Information */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-primary-500 text-primary-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Description
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                FAQ
              </button>
            </nav>
          </div>
          
          <div className="py-8 prose prose-lg max-w-none">
            <h2>Product Description</h2>
            <p>
              {product.description}
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h3>Features</h3>
            <ul>
              <li>Feature 1: Lorem ipsum dolor sit amet</li>
              <li>Feature 2: Consectetur adipiscing elit</li>
              <li>Feature 3: Sed do eiusmod tempor incididunt</li>
              <li>Feature 4: Ut labore et dolore magna aliqua</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}