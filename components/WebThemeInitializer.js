import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { THEME_MODE, THEME_STORAGE_KEY, useTheme } from '../context/ThemeContext';

// Component to initialize and sync web theme
export function WebThemeInitializer() {
  const { theme, themeMode } = useTheme();
  
  // Only needed on web
  if (Platform.OS !== 'web') {
    return null;
  }
  
  // Inject CSS for theme
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Add style tag if it doesn't exist
    let styleTag = document.getElementById('theme-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'theme-styles';
      document.head.appendChild(styleTag);
    }
    
    // Define CSS
    styleTag.innerHTML = `
      body.dark-theme {
        background-color: #121212;
        color: #FFFFFF;
      }
      [data-theme="dark"] {
        color-scheme: dark;
      }
      [data-theme="light"] {
        color-scheme: light;
      }
    `;
  }, []);
  
  // Apply theme to document
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Apply theme attribute to HTML element
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply theme class to body
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    console.log('Applied theme to document:', theme);
  }, [theme]);
  
  // Setup system theme detection
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    // Handle system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only react to system theme changes if in system mode
      if (themeMode === THEME_MODE.SYSTEM) {
        const newTheme = e.matches ? 'dark' : 'light';
        console.log('System theme changed to:', newTheme);
        
        // Update document directly
        document.documentElement.setAttribute('data-theme', newTheme);
        if (newTheme === 'dark') {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      }
    };
    
    // Add event listener for theme changes
    if (darkModeMediaQuery.addEventListener) {
      darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else if (darkModeMediaQuery.addListener) {
      darkModeMediaQuery.addListener(handleSystemThemeChange);
      return () => darkModeMediaQuery.removeListener(handleSystemThemeChange);
    }
  }, [themeMode]);
  
  return null;
}