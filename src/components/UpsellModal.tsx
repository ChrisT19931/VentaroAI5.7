'use client';

import React from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import CountdownTimer from '@/components/CountdownTimer';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerProductId: string;
  upsellProductId: string;
  upsellProduct: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image_url?: string | null;
  };
}

export default function UpsellModal({
  isOpen,
  onClose,
  triggerProductId,
  upsellProductId,
  upsellProduct,
}: UpsellModalProps) {
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);
  const alreadyInCart = isInCart(upsellProductId);

  const handleAddToCart = () => {
    if (alreadyInCart) {
      onClose();
      return;
    }
    
    setIsAdding(true);
    
    addItem({
      id: upsellProductId,
      name: upsellProduct.name,
      price: upsellProduct.price,
      quantity: 1,
      image_url: upsellProduct.image_url,
    });
    
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/20"
      overlayClassName="backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-blue-500/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade Your AI Arsenal!</h2>
          <p className="text-gray-300">Complete your collection with this perfect companion to your AI Prompts.</p>
          {/* Only show countdown timer for coaching product upsells */}
          {upsellProduct.id === '3' && (
            <CountdownTimer variant="compact" className="mt-4" />
          )}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700/50">
          <div className="flex items-center space-x-4">
            {upsellProduct.image_url && (
              <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-900">
                <Image
                  src={upsellProduct.image_url}
                  alt={upsellProduct.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{upsellProduct.name}</h3>
              <p className="text-gray-300 text-sm line-clamp-2 mb-2">{upsellProduct.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-400">{formatPrice(upsellProduct.price)}</span>
                <span className="text-sm text-green-400 font-medium">Special Offer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-800/30">
          <h4 className="text-blue-300 font-medium mb-2">Why Add This to Your Cart?</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Comprehensive AI mastery guide with practical examples</span>
            </li>
            <li className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Perfect companion to your AI Prompts collection</span>
            </li>
            <li className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Learn how to maximize the value of your prompts</span>
            </li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${alreadyInCart
              ? 'bg-green-600 text-white cursor-default'
              : isAdding
                ? 'bg-blue-500 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]'}`}
          >
            {alreadyInCart
              ? 'Already in Cart'
              : isAdding
                ? 'Adding...'
                : 'Add to Cart - ' + formatPrice(upsellProduct.price)
            }
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-lg font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            No Thanks
          </button>
        </div>
      </div>
    </Modal>
  );
}