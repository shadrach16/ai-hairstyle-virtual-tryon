import { useState, useEffect } from 'react';

/**
 * A custom hook that delays updating a value until a specified time has passed.
 * @param value The value to debounce (e.g., a search query).
 * @param delay The delay in milliseconds (e.g., 500).
 * @returns The debounced value, which only updates after the delay.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay is over.
    // This is the core of the debouncing logic, as it resets the timer on every keystroke.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // This effect re-runs whenever the value or delay changes

  return debouncedValue;
}