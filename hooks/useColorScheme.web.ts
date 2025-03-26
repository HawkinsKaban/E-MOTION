import { useState, useEffect } from 'react';
import themeManager from '../utils/themeManager';

/**
 * Web-specific implementation of useColorScheme
 * Works the same as the normal hook
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