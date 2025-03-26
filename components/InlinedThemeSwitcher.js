import React, { useState, useEffect, useContext } from 'react';
import { View, Switch, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { ThemedText } from './ThemedText';

// Konstanta untuk kunci penyimpanan tema
const THEME_STORAGE_KEY = 'app_theme';

// Buat context untuk tema
export const ThemeContext = React.createContext({
  theme: 'light',
  setTheme: () => {}
});

// Hook untuk menggunakan ThemeContext
export const useAppTheme = () => useContext(ThemeContext);

// Provider tema yang akan membungkus aplikasi
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  // Muat tema dari AsyncStorage saat aplikasi dimulai
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Fungsi untuk mengubah dan menyimpan tema
  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Komponen Switch Tema
export function InlinedThemeSwitcher() {
  const { theme, setTheme } = useAppTheme();
  const isDarkMode = theme === 'dark';
  
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  // Warna berdasarkan tema saat ini
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