'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import { useState, memo, useCallback } from 'react';
import UpsellModal from '@/components/UpsellModal';

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

function ProductCard({
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
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const alreadyInCart = isInCart(id);
  
  // E-book upsell product details
  const ebookUpsellProduct = {
    id: 'ai-tools-mastery-guide-2025',
    name: 'AI Tools Mastery Guide 2025',
    price: 25.00,
    description: 'Comprehensive guide to mastering AI tools for business and personal productivity.',
    image_url: '/images/products/ai-tools-mastery-guide.jpg'
  };

  const productUrl = slug ? `/products/${slug}` : `/products/${id}`;
  
  const handleAddToCart = useCallback(() => {
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
      
      // Show upsell modal if the user added the AI Prompts product
      if (id === 'ai-prompts-arsenal-2025' || name.toLowerCase().includes('prompt')) {
        // Check if the e-book is not already in the cart
        if (!isInCart(ebookUpsellProduct.id)) {
          setShowUpsellModal(true);
        }
      }
    }, 800); // Reduced from 1500ms to 800ms for faster feedback
  }, [addItem, alreadyInCart, ebookUpsellProduct.id, id, isInCart, name, image_url, price]);
  
  const handleCloseUpsellModal = useCallback(() => {
    setShowUpsellModal(false);
  }, []);

  return (
    <div className={`glass-panel rounded-lg overflow-hidden transition-all duration-200 hover:shadow-xl ${className}`}>
      <Link href={productUrl} className="block relative">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain transition-transform duration-200 hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {productType && (
            <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full ${productType === 'digital' ? 'bg-blue-500/80 text-white' : 'bg-green-500/80 text-white'}`}>
              {productType === 'digital' ? 'Digital' : 'Physical'}
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{name}</h3>
          
          {description && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{description}</p>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-400">{formatPrice(price)}</span>
          </div>
        </div>
      </Link>
      
      {showAddToCart && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            disabled={alreadyInCart || isAdding}
            className={`w-full py-2 px-4 rounded-md transition-all duration-200 ${alreadyInCart
              ? 'bg-green-500 text-white cursor-default shadow-lg shadow-green-500/20'
              : isAdding
                ? 'bg-blue-400 text-white cursor-wait shadow-lg shadow-blue-400/20'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-700/30 hover:scale-[1.02]'}`}
          >
            {alreadyInCart
              ? 'Added to cart'
              : isAdding
                ? 'Adding...'
                : 'Add to cart'
            }
          </button>
        </div>
      )}
      
      {/* Upsell Modal */}
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={handleCloseUpsellModal}
        triggerProductId={id}
        upsellProductId={ebookUpsellProduct.id}
        upsellProduct={ebookUpsellProduct}
      />
    </div>
  );
}

export default memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.price === nextProps.price &&
    prevProps.image_url === nextProps.image_url &&
    prevProps.showAddToCart === nextProps.showAddToCart &&
    prevProps.className === nextProps.className
  );
});