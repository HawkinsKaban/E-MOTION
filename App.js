import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { WebThemeScript } from './components/WebThemeScript';

// Konstanta untuk kunci penyimpanan tema
const THEME_STORAGE_KEY = 'app_theme';

// Buat tema default dan context
const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// App wrapper dengan ThemeProvider
export default function App() {
  // Gunakan implementasi berbeda untuk web vs native
  if (Platform.OS === 'web') {
    return <WebApp />;
  } else {
    return <NativeApp />;
  }
}

// Implementasi untuk aplikasi web
function WebApp() {
  const [theme, setTheme] = useState('light');
  
  // Fungsi untuk toggle tema pada web
  const toggleTheme = () => {
    // Gunakan fungsi global yang sudah didefine di WebThemeScript
    if (typeof window !== 'undefined' && window.toggleTheme) {
      const newTheme = window.toggleTheme();
      setTheme(newTheme);
    } else {
      // Fallback jika fungsi global tidak tersedia
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }
  };
  
  // Perbarui state tema berdasarkan attribut dokumen saat komponen di-mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    }
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SafeAreaProvider>
        {/* Tambahkan script tema di awal, sebelum rendering komponen lain */}
        <WebThemeScript />
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Slot />
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

// Implementasi untuk aplikasi native
function NativeApp() {
  const deviceTheme = useDeviceColorScheme();
  const [theme, setTheme] = useState(deviceTheme || 'light');
  
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
  
  // Fungsi untuk toggle tema
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SafeAreaProvider>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Slot />
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

// Export context untuk digunakan di seluruh aplikasi
export { ThemeContext };