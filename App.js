import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WebThemeInitializer } from './components/WebThemeInitializer';

// Main App component
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// App content with theme applied
function AppContent() {
  const { theme } = useTheme();
  
  return (
    <SafeAreaProvider>
      {/* Initialize web theme */}
      <WebThemeInitializer />
      
      {/* Set status bar based on theme */}
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      {/* Main app content */}
      <Slot />
    </SafeAreaProvider>
  );
}