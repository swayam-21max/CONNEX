import { useState, useEffect, useCallback } from 'react';

/**
 * useDebounce — delays updating `value` by `delay` ms.
 * Used for search inputs to avoid firing API calls on every keystroke.
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
