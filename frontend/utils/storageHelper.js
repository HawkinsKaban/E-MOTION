import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined' && window !== null;

// Storage helper that works in both web and native
const storageHelper = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web' && isBrowser() && window.localStorage) {
        return window.localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },
  
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web' && isBrowser() && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },
  
  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web' && isBrowser() && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }
};

export default storageHelper;