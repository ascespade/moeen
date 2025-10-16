import { _useState, useCallback } from "react";

import { _storage } from "@/utils/storage";
// Local storage hooks

export const __useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (_value: T | ((_val: T) => T)) => void, () => void] => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const __item = storage.get<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const __setValue = useCallback(
    (_value: T | ((_val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storage.set(key, valueToStore);
      } catch (error) {}
    },
    [key, storedValue],
  );

  const __removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.remove(key);
    } catch (error) {}
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export const __useSessionStorage = <T>(
  key: string,
  initialValue: T,
): [T, (_value: T | ((_val: T) => T)) => void, () => void] => {
  // Get from session storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const __item = storage.getSession<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
  const __setValue = useCallback(
    (_value: T | ((_val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storage.setSession(key, valueToStore);
      } catch (error) {}
    },
    [key, storedValue],
  );

  const __removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.removeSession(key);
    } catch (error) {}
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
