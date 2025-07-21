'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartContext } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import { useState } from 'react';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string | null;
  slug?: string;
  productType?: 'digital' | 'physical';
  showAddToCart?: boolean;
  className?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  description,
  image_url,
  slug,
  productType = 'digital',
  showAddToCart = true,
  className = '',
}: ProductCardProps) {
  const { addItem, isInCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const alreadyInCart = isInCart(id);

  const productUrl = slug ? `/products/${slug}` : `/products/${id}`;
  
  const handleAddToCart = () => {
    if (alreadyInCart) return;
    
    setIsAdding(true);
    
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image_url,
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
      <Link href={productUrl} className="block relative">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {productType && (
            <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full ${productType === 'digital' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              {productType === 'digital' ? 'Digital' : 'Physical'}
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{name}</h3>
          
          {description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-primary-600">{formatPrice(price)}</span>
          </div>
        </div>
      </Link>
      
      {showAddToCart && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            disabled={alreadyInCart || isAdding}
            className={`w-full py-2 px-4 rounded-md transition-colors ${alreadyInCart
              ? 'bg-green-500 text-white cursor-default'
              : isAdding
                ? 'bg-primary-300 text-white cursor-wait'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {alreadyInCart
              ? 'Added to Cart'
              : isAdding
                ? 'Adding...'
                : 'Add to Cart'
            }
          </button>
        </div>
      )}
    </div>
  );
}