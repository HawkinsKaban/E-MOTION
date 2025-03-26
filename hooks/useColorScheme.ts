import { useState, useEffect } from 'react';
import themeManager from '../utils/themeManager';

/**
 * Hook that returns the current theme (light/dark)
 * Compatible with RN's useColorScheme
 */
export function useColorScheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    themeManager.getTheme() as 'light' | 'dark'
  );
  
  // Subscribe to theme changes
  useEffect(() => {
    const unsubscribe = themeManager.addThemeListener((newTheme) => {
      setTheme(newTheme as 'light' | 'dark');
    });
    
    return unsubscribe;
  }, []);
  
  return theme;
}