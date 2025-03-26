import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { ThemedText } from './ThemedText';
import { useTheme, THEME_MODE } from '../context/ThemeContext';
import { useColorScheme } from '../hooks/useColorScheme';

/*
 * Component to toggle between Light/Dark/System theme options
 * This is an optional component that can be added to the profile screen
 */
export function ThemeSystemToggle() {
  const { themeMode, setThemeMode } = useTheme();
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Tema Aplikasi</ThemedText>
      
      <View style={styles.optionsContainer}>
        <ThemeOption 
          icon="sunny" 
          label="Terang" 
          isSelected={themeMode === THEME_MODE.LIGHT}
          onSelect={() => setThemeMode(THEME_MODE.LIGHT)}
          colorScheme={colorScheme}
        />
        
        <ThemeOption 
          icon="moon" 
          label="Gelap" 
          isSelected={themeMode === THEME_MODE.DARK}
          onSelect={() => setThemeMode(THEME_MODE.DARK)}
          colorScheme={colorScheme}
        />
        
        <ThemeOption 
          icon="phone-portrait" 
          label="Sistem" 
          isSelected={themeMode === THEME_MODE.SYSTEM}
          onSelect={() => setThemeMode(THEME_MODE.SYSTEM)}
          colorScheme={colorScheme}
        />
      </View>
    </View>
  );
}

// Individual theme option button
function ThemeOption({ icon, label, isSelected, onSelect, colorScheme }) {
  return (
    <TouchableOpacity 
      style={[
        styles.optionButton,
        isSelected && { 
          backgroundColor: Colors[colorScheme].tint + '20',
          borderColor: Colors[colorScheme].tint 
        }
      ]}
      onPress={onSelect}
    >
      <Ionicons 
        name={icon} 
        size={22} 
        color={isSelected ? Colors[colorScheme].tint : Colors[colorScheme].subtext} 
      />
      <ThemedText 
        style={[
          styles.optionLabel,
          isSelected && { 
            color: Colors[colorScheme].tint,
            fontWeight: '600' 
          }
        ]}
        lightColor={isSelected ? Colors[colorScheme].tint : Colors.light.text}
        darkColor={isSelected ? Colors[colorScheme].tint : Colors.dark.text}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionLabel: {
    fontSize: 12,
    marginTop: 4,
  }
});