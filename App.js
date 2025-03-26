import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';

// Component that uses the theme context to set the status bar
function ThemedStatusBar() {
  const { colorScheme } = useThemeContext();
  return (
    <StatusBar 
      barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={colorScheme === 'dark' ? '#121212' : '#FFFFFF'} 
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <ThemedStatusBar />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}