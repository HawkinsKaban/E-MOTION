import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { ThemedText } from './ThemedText';
import { useTheme } from '../context/ThemeContext';

export function DirectThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  
  // Update the switch state when theme changes
  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);
  
  // Toggle theme function
  const toggleTheme = (value) => {
    const newTheme = value ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  // Get colors based on current theme
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