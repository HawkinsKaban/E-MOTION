import { useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'app_theme';

export function useColorScheme() {
  const deviceTheme = useDeviceColorScheme();
  const [theme, setTheme] = useState(deviceTheme);

  useEffect(() => {
    // Muat tema dari AsyncStorage saat komponen dipasang
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          // Jika tidak ada tema tersimpan, gunakan tema perangkat
          setTheme(deviceTheme || 'light');
        }
      } catch (error) {
        console.log('Error loading theme:', error);
        setTheme(deviceTheme || 'light');
      }
    };

    loadTheme();
  }, [deviceTheme]);

  return theme;
}