import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { useColorScheme } from './hooks/useColorScheme';
import themeManager from './utils/themeManager';
import { Platform } from 'react-native';

// Check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined' && window !== null;

// Simple App component
export default function App() {
  const colorScheme = useColorScheme();
  
  // Initialize theme system on startup
  useEffect(() => {
    if (Platform.OS !== 'web' || isBrowser()) {
      themeManager.initialize();
    }
  }, []);
  
  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </SafeAreaProvider>
  );
}