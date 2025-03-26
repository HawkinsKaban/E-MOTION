import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

// Hook for accessing theme from context
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    console.error('useTheme must be used within a ThemeProvider');
    // Return a default value to prevent crashes
    return { 
      theme: 'light', 
      themeMode: 'system',
      setThemeMode: () => {},
      toggleTheme: () => {}
    };
  }
  
  return context;
}