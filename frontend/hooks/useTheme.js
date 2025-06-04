import { useState, useEffect } from 'react';
import themeManager from '../utils/themeManager';

/**
 * Hook to access and control the app's theme
 */
export function useTheme() {
  const [theme, setTheme] = useState(themeManager.getTheme());
  const [themeMode, setThemeMode] = useState(themeManager.getThemeMode());
  
  // Listen for theme changes from the theme manager
  useEffect(() => {
    const unsubscribe = themeManager.addThemeListener((newTheme) => {
      setTheme(newTheme);
      setThemeMode(themeManager.getThemeMode());
    });
    
    return unsubscribe;
  }, []);
  
  return {
    // Current theme (light/dark)
    theme,
    
    // Current theme mode (light/dark/system)
    themeMode,
    
    // Function to set the theme mode
    setThemeMode: themeManager.setThemeMode,
    
    // Function to toggle between light/dark
    toggleTheme: themeManager.toggleTheme,
    
    // Theme mode constants
    THEME_MODE: themeManager.THEMES
  };
}