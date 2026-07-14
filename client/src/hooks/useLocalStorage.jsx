import { useState, useEffect } from "react";

/**
 * Custom hook to manage React state synchronized seamlessly with browser LocalStorage.
 * @param {string} key - The localStorage configuration tracking key name string.
 * @param {any} initialValue - The fallback value if no data exists in localStorage yet.
 */
export function useLocalStorage(key, initialValue) {
  // 1. Initialize state layout by checking for existing data in localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // If data exists, parse the JSON string; otherwise, return the initial fallback parameter
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Synchronize your active state changes right back into localStorage automatically
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
