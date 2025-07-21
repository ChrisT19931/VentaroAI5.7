/**
 * Utility functions for working with browser localStorage with type safety
 */

/**
 * Gets an item from localStorage with type safety
 * @param key The key to retrieve
 * @param defaultValue The default value to return if the key doesn't exist
 * @returns The parsed value or the default value
 */
export function getStorageItem<T>(
  key: string,
  defaultValue: T
): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Sets an item in localStorage with type safety
 * @param key The key to set
 * @param value The value to store
 * @returns Boolean indicating success
 */
export function setStorageItem<T>(
  key: string,
  value: T
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
}

/**
 * Removes an item from localStorage
 * @param key The key to remove
 * @returns Boolean indicating success
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Clears all items from localStorage
 * @returns Boolean indicating success
 */
export function clearStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Creates a namespaced storage utility to avoid key collisions
 * @param namespace The namespace prefix for all keys
 * @returns Object with namespaced storage methods
 */
export function createNamespacedStorage(namespace: string) {
  const prefix = `${namespace}:`;
  
  return {
    getItem<T>(key: string, defaultValue: T): T {
      return getStorageItem<T>(`${prefix}${key}`, defaultValue);
    },
    
    setItem<T>(key: string, value: T): boolean {
      return setStorageItem<T>(`${prefix}${key}`, value);
    },
    
    removeItem(key: string): boolean {
      return removeStorageItem(`${prefix}${key}`);
    },
    
    clear(): void {
      // Only clear items in this namespace
      if (typeof window === 'undefined') {
        return;
      }
      
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith(prefix))
          .forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.error(`Error clearing namespace ${namespace} from localStorage:`, error);
      }
    },
  };
}

// Create a namespaced storage for the app
export const appStorage = createNamespacedStorage('ai-digital-store');