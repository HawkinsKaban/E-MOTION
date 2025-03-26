import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { ThemedText } from './ThemedText';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface ThemeSwitchProps {
  containerStyle?: any;
}

export function ThemeSwitch({ containerStyle }: ThemeSwitchProps) {
  const { theme, setTheme, colorScheme } = useThemeContext();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  
  // Update the switch when the theme changes
  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);
  
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
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