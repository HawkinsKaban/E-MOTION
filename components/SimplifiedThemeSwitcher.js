import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { ThemedText } from './ThemedText';

const THEME_STORAGE_KEY = 'app_theme';

export default function SimplifiedThemeSwitcher() {
  const deviceTheme = useDeviceColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');
  
  // Load saved theme when component mounts
  useEffect(() => {
    loadTheme();
  }, []);
  
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };
  
  const toggleTheme = async (value) => {
    setIsDarkMode(value);
    const newTheme = value ? 'dark' : 'light';
    
    try {
      // Simpan preferensi tema
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      
      // Terapkan tema baru dengan segera (reload app)
      // Cara sederhana namun efektif untuk menerapkan tema baru
      setTimeout(() => {
        if (Platform.OS === 'web') {
          window.location.reload();
        } else {
          DevSettings.reload();
        }
      }, 100);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };
  
  // Get colors based on current theme
  const colorScheme = isDarkMode ? 'dark' : 'light';
  const tintColor = Colors[colorScheme].tint;
  
  return (
    <View style={styles.container}>
      <View style={styles.iconTextContainer}>
        <Ionicons 
          name={isDarkMode ? "moon" : "sunny"} 
          size={22} 
          color={tintColor} 
          style={styles.icon} 
        />
        <ThemedText style={styles.text}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </ThemedText>
      </View>
      
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ 
          false: '#767577', 
          true: tintColor + '70'
        }}
        thumbColor={isDarkMode ? tintColor : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
  }
});