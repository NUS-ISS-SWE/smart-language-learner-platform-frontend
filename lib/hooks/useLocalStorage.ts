'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for type-safe localStorage access with JSON serialization
 * Automatically syncs with localStorage and handles SSR
 *
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Tuple of [value, setValue] similar to useState
 *
 * @example
 * const [savedCourse, setSavedCourse] = useLocalStorage('selectedCourse', null);
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Avoid SSR issues by only reading from localStorage on client
    if (globalThis.window === undefined) {
      return defaultValue;
    }

    try {
      const item = globalThis.window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        // Allow function to be passed like setState
        const valueToStore = typeof value === 'function' ? value(storedValue) : value;
        setStoredValue(valueToStore);

        // Write to localStorage only on client
        if (globalThis.window !== undefined) {
          globalThis.window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error writing to localStorage for key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error syncing localStorage for key "${key}":`, error);
        }
      }
    };

    globalThis.addEventListener('storage', handleStorageChange);
    return () => globalThis.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
