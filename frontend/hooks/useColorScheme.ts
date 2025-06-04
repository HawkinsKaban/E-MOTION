import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import themeManager from '../utils/themeManager';

/**
 * Hook that returns the current theme (light/dark)
 * Compatible with RN's useColorScheme
 */
export function useColorScheme(): 'light' | 'dark' {
  // Default to light theme during initial render
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Subscribe to theme changes after component mounts
  useEffect(() => {
    // Set the current theme
    setTheme(themeManager.getTheme() as 'light' | 'dark');
    
    const unsubscribe = themeManager.addThemeListener((newTheme) => {
      setTheme(newTheme as 'light' | 'dark');
    });
    
    return unsubscribe;
  }, []);
  
  return theme;
}