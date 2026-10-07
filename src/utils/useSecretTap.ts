import { useRef } from 'react';

/**
 * Returns a click handler that fires `onTrigger` after `taps` clicks within `windowMs`.
 * Used for the hidden Demo Reset gesture.
 */
export function useSecretTap(onTrigger: () => void, taps = 5, windowMs = 2000) {
  const stamps = useRef<number[]>([]);
  return () => {
    const now = Date.now();
    stamps.current = [...stamps.current.filter((t) => now - t < windowMs), now];
    if (stamps.current.length >= taps) {
      stamps.current = [];
      onTrigger();
    }
  };
}
