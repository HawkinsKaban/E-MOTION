import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, useColorScheme as useDeviceColorScheme } from 'react-native';

// Simple theme constants
export const THEME_STORAGE_KEY = 'app_theme';
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Create the context with default values
const ThemeContext = createContext({
  theme: THEME_MODE.LIGHT,
  themeMode: THEME_MODE.SYSTEM,
  setTheme: () => {},
  toggleTheme: () => {},
  setThemeMode: () => {},
});

// Get system theme on web
const getSystemTheme = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 
      THEME_MODE.DARK : THEME_MODE.LIGHT;
  }
  return THEME_MODE.LIGHT;
};

// ThemeProvider component
export function ThemeProvider({ children }) {
  const deviceTheme = useDeviceColorScheme() || getSystemTheme();
  const [themeMode, setThemeMode] = useState(THEME_MODE.SYSTEM);
  const [theme, setTheme] = useState(deviceTheme);

  // Load saved theme
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        // Try to get theme from localStorage (web) or AsyncStorage
        let savedThemeMode;
        
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          savedThemeMode = window.localStorage.getItem(THEME_STORAGE_KEY);
          console.log('Loaded theme from localStorage:', savedThemeMode);
        } else {
          savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
          console.log('Loaded theme from AsyncStorage:', savedThemeMode);
        }
        
        // Set theme mode if valid
        if (savedThemeMode && Object.values(THEME_MODE).includes(savedThemeMode)) {
          setThemeMode(savedThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadSavedTheme();
  }, []);

  // Update actual theme when theme mode changes
  useEffect(() => {
    if (themeMode === THEME_MODE.SYSTEM) {
      setTheme(deviceTheme);
    } else {
      setTheme(themeMode);
    }
  }, [themeMode, deviceTheme]);

  // Save theme preference
  const saveThemePreference = async (newTheme) => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        
        // For web, also update document theme directly
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', 
            newTheme === THEME_MODE.SYSTEM ? 
              (getSystemTheme() === THEME_MODE.DARK ? 'dark' : 'light') :
              newTheme
          );
          
          // Update body class for CSS
          if ((newTheme === THEME_MODE.DARK) || 
              (newTheme === THEME_MODE.SYSTEM && getSystemTheme() === THEME_MODE.DARK)) {
            document.body.classList.add('dark-theme');
          } else {
            document.body.classList.remove('dark-theme');
          }
        }
      }
      
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Function to set theme mode
  const handleSetThemeMode = (newMode) => {
    setThemeMode(newMode);
    saveThemePreference(newMode);
  };

  // Simple toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    setTheme(newTheme);
    setThemeMode(newTheme);
    saveThemePreference(newTheme);
    return newTheme;
  };

  return (
    <ThemeContext.Provider 
      value={{
        theme,
        themeMode,
        setTheme,
        toggleTheme,
        setThemeMode: handleSetThemeMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}