import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { useColorScheme } from './hooks/useColorScheme';
import themeManager from './utils/themeManager';

// Simple App component
export default function App() {
  const colorScheme = useColorScheme();
  
  // Initialize theme system on startup
  useEffect(() => {
    themeManager.initialize();
  }, []);
  
  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </SafeAreaProvider>
  );
}