import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Enhanced useColorScheme hook for web
 * - Supports client-side rendering
 * - Works with ThemeContext
 * - Handles hydration properly
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { theme } = useTheme();
  
  // For initial SSR, provide a default theme
  // After hydration, use the actual theme from context
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  
  // Debug for web troubleshooting
  useEffect(() => {
    if (hasHydrated) {
      console.log('Web useColorScheme theme:', theme);
    }
  }, [hasHydrated, theme]);
  
  // During SSR, return light theme to avoid hydration mismatch
  // After hydration, return the actual theme from context
  return hasHydrated ? theme : 'light';
}