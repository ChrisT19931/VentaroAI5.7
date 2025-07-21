import { useState, useEffect, useCallback } from 'react';
import { appStorage } from '@/utils/storage-client';

export type CartItem = {
  id: string;
  name: string;
  price: number; // in cents
  quantity: number;
  image?: string;
  productType: 'digital' | 'physical';
};

type CartState = {
  items: CartItem[];
  total: number; // in cents
  itemCount: number;
};

const initialCartState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export function useCart() {
  const [cart, setCart] = useState<CartState>(initialCartState);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = appStorage.getItem<CartState>('cart', initialCartState);
    setCart(savedCart);
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      appStorage.setItem('cart', cart);
    }
  }, [cart, isLoading]);

  // Calculate totals whenever items change
  const calculateTotals = useCallback((items: CartItem[]): CartState => {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      items,
      total,
      itemCount,
    };
  }, []);

  // Add item to cart
  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(i => i.id === item.id);
      
      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Item doesn't exist, add new item
        updatedItems = [
          ...currentCart.items,
          { ...item, quantity },
        ];
      }
      
      return calculateTotals(updatedItems);
    });
  }, [calculateTotals]);

  // Update item quantity
  const updateItemQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(id);
    }
    
    setCart(currentCart => {
      const updatedItems = currentCart.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      return calculateTotals(updatedItems);
    });
  }, [calculateTotals]);

  // Remove item from cart
  const removeItem = useCallback((id: string) => {
    setCart(currentCart => {
      const updatedItems = currentCart.items.filter(item => item.id !== id);
      return calculateTotals(updatedItems);
    });
  }, [calculateTotals]);

  // Clear the entire cart
  const clearCart = useCallback(() => {
    setCart(initialCartState);
  }, []);

  // Check if an item is in the cart
  const isInCart = useCallback((id: string) => {
    return cart.items.some(item => item.id === id);
  }, [cart.items]);

  // Get a specific item from the cart
  const getItem = useCallback((id: string) => {
    return cart.items.find(item => item.id === id);
  }, [cart.items]);

  return {
    cart,
    isLoading,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    isInCart,
    getItem,
  };
}