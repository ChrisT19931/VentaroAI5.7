'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    };
    
    addItem(cartItem);
    
    setTimeout(() => {
      setIsAdding(false);
      // Go directly to checkout/payment page
      router.push('/checkout');
    }, 500);
  };

  const handleBuyNow = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    };
    
    addItem(cartItem);
    // Go directly to checkout/payment page instead of cart
    router.push('/checkout');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button
          onClick={decreaseQuantity}
          className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        >
          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center text-gray-700">
          {quantity}
        </div>
        <button
          onClick={increaseQuantity}
          className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        >
          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`btn-primary flex-1 flex items-center justify-center ${isAdding ? 'opacity-75' : ''}`}
        >
          {isAdding ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
        <button
          onClick={handleBuyNow}
          className="btn-secondary flex-1"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}