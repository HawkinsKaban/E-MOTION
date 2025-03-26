import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { ThemedText } from './ThemedText';
import * as Updates from 'expo-updates';

const THEME_STORAGE_KEY = 'app_theme';

export function DirectThemeSwitcher() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Load current theme when component mounts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        setIsDarkMode(savedTheme === 'dark');
      } catch (error) {
        console.log('Error loading theme preference:', error);
        // Default to system preference if nothing saved
        setIsDarkMode(systemColorScheme === 'dark');
      }
    };
    
    loadTheme();
  }, [systemColorScheme]);
  
  const toggleTheme = async (value) => {
    setIsDarkMode(value);
    const newTheme = value ? 'dark' : 'light';
    
    try {
      // Save the new theme preference
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      
      // Force reload the app to apply the theme
      if (Platform.OS === 'web') {
        window.location.reload();
      } else {
        try {
          await Updates.reloadAsync();
        } catch (error) {
          console.log('Error reloading app:', error);
        }
      }
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };
  
  // Get correct color scheme for current state
  const colorScheme = isDarkMode ? 'dark' : 'light';
  
  return (
    <View style={styles.container}>
      <View style={styles.iconTextContainer}>
        <Ionicons 
          name={isDarkMode ? "moon" : "sunny"} 
          size={22} 
          color={Colors[colorScheme].tint} 
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
          true: Colors[colorScheme].tint + '70'
        }}
        thumbColor={isDarkMode ? Colors[colorScheme].tint : '#f4f3f4'}
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