import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// App wrapper with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// Inner component that has access to the theme context
function AppContent() {
  const { theme } = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </SafeAreaProvider>
  );
}