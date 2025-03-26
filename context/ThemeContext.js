import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme, Platform } from 'react-native';

// Key for storing theme in AsyncStorage
export const THEME_STORAGE_KEY = 'app_theme';

// Values for theme mode selection
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Create the theme context
export const ThemeContext = createContext({
  themeMode: THEME_MODE.SYSTEM,
  theme: THEME_MODE.LIGHT,
  setThemeMode: () => {},
});

// For web compatibility, get default color scheme
const getDefaultColorScheme = () => {
  // Check if window and matchMedia are available (only in browser)
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? THEME_MODE.DARK 
      : THEME_MODE.LIGHT;
  }
  // Fallback to light
  return THEME_MODE.LIGHT;
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component to wrap the app
export function ThemeProvider({ children }) {
  // Use appropriate device theme detection
  const deviceTheme = useDeviceColorScheme() || getDefaultColorScheme();
  
  // Store the mode selection (light, dark, or system)
  const [themeMode, setThemeModeState] = useState(THEME_MODE.SYSTEM);
  
  // Store the actual theme separately to avoid flashing
  const [theme, setTheme] = useState(deviceTheme);
  
  // Store user preference in appropriate storage
  const saveThemePreference = async (value) => {
    try {
      // For web, also use localStorage for better compatibility
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, value);
      }
      
      // Always try AsyncStorage too
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  // Load saved preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        let savedTheme = null;
        
        // For web, try localStorage first
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        }
        
        // If not found, try AsyncStorage
        if (!savedTheme) {
          savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        }
        
        // Apply saved theme if available
        if (savedTheme && Object.values(THEME_MODE).includes(savedTheme)) {
          console.log('Loaded saved theme preference:', savedTheme);
          setThemeModeState(savedTheme);
        } else {
          console.log('No saved theme found, using system default');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Update theme when themeMode or device theme changes
  useEffect(() => {
    if (themeMode === THEME_MODE.SYSTEM) {
      setTheme(deviceTheme);
      console.log('Using system theme:', deviceTheme);
    } else {
      setTheme(themeMode);
      console.log('Using user selected theme:', themeMode);
    }
  }, [themeMode, deviceTheme]);
  
  // Web-specific: Listen for system theme changes
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleThemeChange = (e) => {
        if (themeMode === THEME_MODE.SYSTEM) {
          const newTheme = e.matches ? THEME_MODE.DARK : THEME_MODE.LIGHT;
          console.log('System theme changed to:', newTheme);
          setTheme(newTheme);
        }
      };
      
      // Modern browsers
      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleThemeChange);
        return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
      } 
      // Older browsers
      else if (darkModeMediaQuery.addListener) {
        darkModeMediaQuery.addListener(handleThemeChange);
        return () => darkModeMediaQuery.removeListener(handleThemeChange);
      }
    }
  }, [themeMode]);
  
  // Set theme mode and persist it
  const setThemeMode = (newThemeMode) => {
    console.log('Setting theme mode to:', newThemeMode);
    setThemeModeState(newThemeMode);
    saveThemePreference(newThemeMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      themeMode, 
      theme, 
      setThemeMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}