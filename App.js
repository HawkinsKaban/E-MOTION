import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';

// Kita gunakan ini untuk menyimpan tema
const THEME_STORAGE_KEY = 'app_theme';

// Buat tema default (berdasarkan preferensi sistem atau light)
export default function App() {
  const [theme, setTheme] = useState('light');

  // Muat tema yang tersimpan saat aplikasi dimulai
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </SafeAreaProvider>
  );
}