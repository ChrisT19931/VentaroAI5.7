// Unit tests for product ownership logic

import { checkProductOwnership, checkProductOwnershipWithLogging, getOwnedProductIds } from '@/utils/productOwnership';
import { Purchase } from '@/types/product';

// Mock console.log for testing
const mockConsoleLog = jest.fn();
global.console = { ...console, log: mockConsoleLog };

describe('Product Ownership', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  describe('checkProductOwnership', () => {
    it('should recognize direct product_id matches', () => {
      const purchase: Purchase = {
        id: 'test-1',
        product_id: '2',
        customer_email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z'
      };
      expect(checkProductOwnership(purchase, '2')).toBe(true);
    });

    it('should recognize mapped product_ids', () => {
      const purchase: Purchase = {
        id: 'test-2',
        product_id: 'prompts',
        customer_email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z'
      };
      expect(checkProductOwnership(purchase, '2')).toBe(true);
    });

    it('should recognize ebook mapping', () => {
      const purchase: Purchase = {
        id: 'test-3',
        product_id: 'ebook',
        customer_email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z'
      };
      expect(checkProductOwnership(purchase, '1')).toBe(true);
    });

    it('should recognize legacy product mappings', () => {
      const purchase: Purchase = {
        id: 'test-4',
        product_id: 'ai-prompts-arsenal-2025',
        customer_email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z'
      };
      expect(checkProductOwnership(purchase, '2')).toBe(true);
    });

    it('should return false for non-matching products', () => {
      const purchase: Purchase = {
        id: 'test-5',
        product_id: 'unknown-product',
        customer_email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z'
      };
      expect(checkProductOwnership(purchase, '1')).toBe(false);
    });
  });

  describe('checkProductOwnershipWithLogging', () => {
    it('should log when ownership is found and logging is enabled', () => {
      const purchase: Purchase = {
        id: 'test-6',
        product_id: 'ebook',
        customer_email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z'
      };
      
      const result = checkProductOwnershipWithLogging(purchase, '1', true);
      
      expect(result).toBe(true);
      expect(mockConsoleLog).toHaveBeenCalledWith('User owns product 1 via purchase ebook');
    });

    it('should not log when logging is disabled', () => {
      const purchase: Purchase = {
        id: 'test-7',
        product_id: 'ebook',
        customer_email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z'
      };
      
      const result = checkProductOwnershipWithLogging(purchase, '1', false);
      
      expect(result).toBe(true);
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe('getOwnedProductIds', () => {
    it('should return all owned product IDs', () => {
      const purchases: Purchase[] = [
        {
          id: 'test-8',
          product_id: 'ebook',
          customer_email: 'test@example.com',
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'test-9',
          product_id: 'prompts',
          customer_email: 'test@example.com',
          created_at: '2025-01-01T00:00:00Z'
        }
      ];
      
      const allProductIds = ['1', '2', '3'];
      const ownedIds = getOwnedProductIds(purchases, allProductIds);
      
      expect(ownedIds).toEqual(['1', '2']);
    });

    it('should return empty array when no products are owned', () => {
      const purchases: Purchase[] = [];
      const allProductIds = ['1', '2', '3'];
      const ownedIds = getOwnedProductIds(purchases, allProductIds);
      
      expect(ownedIds).toEqual([]);
    });
  });
});