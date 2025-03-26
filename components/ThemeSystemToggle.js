import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { useColorScheme } from '../hooks/useColorScheme';

/**
 * Component for toggling between Light/Dark/System theme options
 */
export function ThemeSystemToggle() {
  const { themeMode, setThemeMode, THEME_MODE } = useTheme();
  const colorScheme = useColorScheme();
  
  console.log('[ThemeSystemToggle] Rendering with themeMode:', themeMode);
  
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Tema Aplikasi</ThemedText>
      
      <View style={styles.optionsContainer}>
        {/* Light Theme Option */}
        <ThemeOption 
          icon="sunny" 
          label="Terang" 
          isSelected={themeMode === THEME_MODE.LIGHT}
          onSelect={() => {
            console.log('[ThemeSystemToggle] Setting theme to Light');
            setThemeMode(THEME_MODE.LIGHT);
          }}
          colorScheme={colorScheme}
        />
        
        {/* Dark Theme Option */}
        <ThemeOption 
          icon="moon" 
          label="Gelap" 
          isSelected={themeMode === THEME_MODE.DARK}
          onSelect={() => {
            console.log('[ThemeSystemToggle] Setting theme to Dark');
            setThemeMode(THEME_MODE.DARK);
          }}
          colorScheme={colorScheme}
        />
        
        {/* System Theme Option */}
        <ThemeOption 
          icon="phone-portrait" 
          label="Sistem" 
          isSelected={themeMode === THEME_MODE.SYSTEM}
          onSelect={() => {
            console.log('[ThemeSystemToggle] Setting theme to System');
            setThemeMode(THEME_MODE.SYSTEM);
          }}
          colorScheme={colorScheme}
        />
      </View>
    </View>
  );
}

/**
 * Individual theme option button
 */
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