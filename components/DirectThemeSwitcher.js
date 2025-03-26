import React from 'react';
import { View, Switch, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { useColorScheme } from '../hooks/useColorScheme';

/**
 * Simple toggle switch for light/dark theme
 */
export function DirectThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const colorScheme = useColorScheme();
  const isDarkMode = theme === 'dark';

  // Get colors based on current theme
  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  
  const handleToggle = () => {
    console.log('[DirectThemeSwitcher] Toggling theme');
    toggleTheme();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconTextContainer}>
        <Ionicons 
          name={isDarkMode ? "moon" : "sunny"} 
          size={22} 
          color={themeColors.tint} 
          style={styles.icon} 
        />
        <ThemedText style={styles.text}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </ThemedText>
      </View>
      
      {Platform.OS === 'web' ? (
        // For web, use a button instead of Switch
        <TouchableOpacity 
          style={[
            styles.webButton,
            { backgroundColor: themeColors.tint }
          ]}
          onPress={handleToggle}
        >
          <ThemedText style={styles.webButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
            {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
          </ThemedText>
        </TouchableOpacity>
      ) : (
        // For native, use Switch
        <Switch
          value={isDarkMode}
          onValueChange={handleToggle}
          trackColor={{ 
            false: '#767577', 
            true: themeColors.tint + '70'
          }}
          thumbColor={isDarkMode ? themeColors.tint : '#f4f3f4'}
        />
      )}
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
  },
  webButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  webButtonText: {
    fontSize: 14,
    fontWeight: '500',
  }
});