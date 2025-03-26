import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
}

// Create the context
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colorScheme: 'light',
  setTheme: () => {},
});

// Create a provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme() || 'light';
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(deviceColorScheme as 'light' | 'dark');
  
  // Load the saved theme preference when the component mounts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Update the color scheme whenever theme or device theme changes
  useEffect(() => {
    if (theme === 'system') {
      setColorScheme(deviceColorScheme as 'light' | 'dark');
    } else {
      setColorScheme(theme as 'light' | 'dark');
    }
  }, [theme, deviceColorScheme]);
  
  // Function to set theme and save to AsyncStorage
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);