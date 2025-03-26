import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Enhanced useColorScheme hook for web
 * - Supports client-side rendering
 * - Works with ThemeContext
 * - Handles hydration properly
 */
export function useColorScheme() {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  
  // For initial SSR, use a default theme
  // After hydration, use the actual theme from context
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // During first render (SSR), return light theme to avoid hydration mismatch
  // After hydration, return the actual theme from context
  return isClient ? theme : 'light';
}