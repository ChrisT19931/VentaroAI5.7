'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { optimizedApiCall } from '@/lib/client-optimizer';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  productType?: 'digital' | 'physical';
  maxQuantity?: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isInCart: (id: string) => boolean;
  getItem: (id: string) => CartItem | undefined;
  isLoading: boolean;
  error: string | null;
  retryOperation: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<(() => void) | null>(null);

  // Memoized calculations for better performance
  const { itemCount, total } = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { itemCount: count, total: cartTotal };
  }, [items]);

  // Enhanced localStorage operations with error handling
  const saveToStorage = useCallback((cartItems: CartItem[]) => {
    optimizedApiCall(async () => {
      const cartData = {
        items: cartItems,
        timestamp: Date.now(),
        version: '1.0'
      };
      localStorage.setItem('cart', JSON.stringify(cartData));
      setError(null);
      return true;
    }, `cart-save-${Date.now()}`, 1000).catch(error => {
      console.error('Failed to save cart to localStorage:', error);
      setError('Failed to save cart. Your changes may not persist.');
      toast.error('Cart save failed. Please try again.');
    });
  }, []);

  const loadFromStorage = useCallback(() => {
    try {
      setIsLoading(true);
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedData = JSON.parse(storedCart);
        
        // Handle both old and new cart formats
        const cartItems = Array.isArray(parsedData) ? parsedData : parsedData.items || [];
        
        // Validate cart items
        const validItems = cartItems.filter((item: any) => 
          item && 
          typeof item.id === 'string' && 
          typeof item.name === 'string' && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        );
        
        setItems(validItems);
        setError(null);
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      setError('Failed to load saved cart.');
      toast.error('Failed to load your saved cart.');
      // Clear corrupted data with optimization
      optimizedApiCall(async () => {
        localStorage.removeItem('cart');
        return true;
      }, 'cart-clear-corrupted', 1000).catch(console.error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cart from localStorage on initial render
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Save cart to localStorage whenever items change (debounced)
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        saveToStorage(items);
      }, 300); // Debounce saves to avoid excessive localStorage writes
      
      return () => clearTimeout(timeoutId);
    }
  }, [items, isLoading, saveToStorage]);

  const addItem = useCallback((item: CartItem) => {
    const operation = () => {
      setItems((prevItems) => {
        try {
          // Validate item
          if (!item.id || !item.name || typeof item.price !== 'number' || item.price < 0) {
            throw new Error('Invalid item data');
          }
          
          // Check if item already exists in cart
          const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
          
          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...prevItems];
            const newQuantity = updatedItems[existingItemIndex].quantity + (item.quantity || 1);
            
            // Check max quantity limit
            if (item.maxQuantity && newQuantity > item.maxQuantity) {
              toast.error(`Maximum quantity (${item.maxQuantity}) reached for ${item.name}`);
              return prevItems;
            }
            
            updatedItems[existingItemIndex].quantity = newQuantity;
            toast.success(`Updated ${item.name} quantity in cart`);
            return updatedItems;
          } else {
            // Add new item to cart
            const newItem = { ...item, quantity: item.quantity || 1 };
            toast.success(`Added ${item.name} to cart`);
            return [...prevItems, newItem];
          }
        } catch (error) {
          console.error('Error adding item to cart:', error);
          setError('Failed to add item to cart');
          toast.error('Failed to add item to cart');
          return prevItems;
        }
      });
    };
    
    setLastOperation(() => operation);
    operation();
  }, []);

  const removeItem = useCallback((id: string) => {
    const operation = () => {
      setItems((prevItems) => {
        try {
          const itemToRemove = prevItems.find(item => item.id === id);
          if (itemToRemove) {
            toast.success(`Removed ${itemToRemove.name} from cart`);
          }
          return prevItems.filter((item) => item.id !== id);
        } catch (error) {
          console.error('Error removing item from cart:', error);
          setError('Failed to remove item from cart');
          toast.error('Failed to remove item from cart');
          return prevItems;
        }
      });
    };
    
    setLastOperation(() => operation);
    operation();
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    
    const operation = () => {
      setItems((prevItems) => {
        try {
          return prevItems.map((item) => {
            if (item.id === id) {
              // Check max quantity limit
              if (item.maxQuantity && quantity > item.maxQuantity) {
                toast.error(`Maximum quantity (${item.maxQuantity}) reached for ${item.name}`);
                return item;
              }
              return { ...item, quantity };
            }
            return item;
          });
        } catch (error) {
          console.error('Error updating item quantity:', error);
          setError('Failed to update item quantity');
          toast.error('Failed to update item quantity');
          return prevItems;
        }
      });
    };
    
    setLastOperation(() => operation);
    operation();
  }, [removeItem]);

  const clearCart = useCallback(() => {
    const operation = () => {
      try {
        setItems([]);
        toast.success('Cart cleared');
        setError(null);
      } catch (error) {
        console.error('Error clearing cart:', error);
        setError('Failed to clear cart');
        toast.error('Failed to clear cart');
      }
    };
    
    setLastOperation(() => operation);
    operation();
  }, []);

  const isInCart = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);
  
  const getItem = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);
  
  const retryOperation = useCallback(() => {
    if (lastOperation) {
      try {
        lastOperation();
        setError(null);
        toast.success('Operation retried successfully');
      } catch (error) {
        console.error('Retry operation failed:', error);
        toast.error('Retry failed. Please try again.');
      }
    } else {
      toast.error('No operation to retry');
    }
  }, [lastOperation]);

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    isInCart,
    getItem,
    clearCart,
    itemCount,
    total,
    isLoading,
    error,
    retryOperation,
  }), [items, addItem, removeItem, updateQuantity, isInCart, getItem, clearCart, itemCount, total, isLoading, error, retryOperation]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};