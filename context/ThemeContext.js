import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

// Key for storing theme in AsyncStorage
export const THEME_STORAGE_KEY = 'app_theme';

// Values for theme mode selection
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system' // Added system option
};

// Create the theme context with default values
export const ThemeContext = createContext({
  themeMode: THEME_MODE.SYSTEM, // Store the mode (light, dark, or system)
  theme: THEME_MODE.LIGHT, // The actual theme to apply (light or dark)
  setThemeMode: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component to wrap the app
export function ThemeProvider({ children }) {
  const deviceTheme = useDeviceColorScheme();
  
  // Store the mode selection (light, dark, or system)
  const [themeMode, setThemeModeState] = useState(THEME_MODE.SYSTEM);
  
  // Determine the actual theme to apply (light or dark)
  const theme = themeMode === THEME_MODE.SYSTEM 
    ? deviceTheme || THEME_MODE.LIGHT 
    : themeMode;

  // Load saved theme mode on initial mount
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeMode) {
          setThemeModeState(savedThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme mode:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Function to update theme mode and save to AsyncStorage
  const setThemeMode = async (newThemeMode) => {
    setThemeModeState(newThemeMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeMode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
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