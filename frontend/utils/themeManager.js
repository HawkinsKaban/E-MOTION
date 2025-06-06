import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storageHelper from './storageHelper';

// Constants
const THEME_KEY = 'app_theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined' && window !== null;

// Listeners for theme changes
const listeners = new Set();

// Theme state
let currentTheme = THEMES.LIGHT;
let currentThemeMode = THEMES.SYSTEM;
let isInitialized = false;

// Get system theme preference
const getSystemTheme = () => {
  if (Platform.OS === 'web' && isBrowser() && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 
      THEMES.DARK : THEMES.LIGHT;
  }
  return THEMES.LIGHT;
};

// Apply theme to DOM (web only)
const applyThemeToDOM = (theme) => {
  if (Platform.OS !== 'web' || !isBrowser()) return;
  
  console.log('[ThemeManager] Applying theme to DOM:', theme);
  
  // Apply to HTML element
  document.documentElement.setAttribute('data-theme', theme);
  
  // Apply to body class
  if (theme === THEMES.DARK) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  
  // Add style tag if needed
  let styleTag = document.getElementById('theme-styles');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'theme-styles';
    document.head.appendChild(styleTag);
  }
  
  // Apply base styles
  styleTag.innerHTML = `
    body.dark-theme {
      background-color: #121212;
      color: #FFFFFF;
    }
    [data-theme="dark"] {
      color-scheme: dark;
    }
    [data-theme="light"] {
      color-scheme: light;
    }
  `;
};

// Notify all registered listeners
const notifyListeners = () => {
  listeners.forEach(listener => {
    try {
      listener(currentTheme);
    } catch (error) {
      console.error('[ThemeManager] Error in listener:', error);
    }
  });
};

// Initialize the theme system
const initialize = async () => {
  if (isInitialized) return currentTheme;
  
  try {
    console.log('[ThemeManager] Initializing...');
    
    // Default to system theme
    currentThemeMode = THEMES.SYSTEM;
    currentTheme = getSystemTheme();
    
    // Try to load saved theme
    let savedTheme;
    
    try {
      savedTheme = await storageHelper.getItem(THEME_KEY);
      console.log('[ThemeManager] Loaded theme:', savedTheme);
    } catch (error) {
      console.log('[ThemeManager] Error loading theme:', error);
    }
    
    // Apply saved theme if valid
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      currentThemeMode = savedTheme;
      
      if (savedTheme === THEMES.SYSTEM) {
        currentTheme = getSystemTheme();
      } else {
        currentTheme = savedTheme;
      }
      
      console.log('[ThemeManager] Using saved theme:', currentThemeMode, currentTheme);
    }
    
    // Apply theme to DOM for web
    if (Platform.OS === 'web' && isBrowser()) {
      applyThemeToDOM(currentTheme);
      setupSystemThemeListener();
    }
    
    isInitialized = true;
    notifyListeners();
    return currentTheme;
  } catch (error) {
    console.error('[ThemeManager] Initialization error:', error);
    return THEMES.LIGHT;
  }
};

// Set up listener for system theme changes
const setupSystemThemeListener = () => {
  if (Platform.OS !== 'web' || !isBrowser() || !window.matchMedia) return;
  
  console.log('[ThemeManager] Setting up system theme listener');
  
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleSystemThemeChange = (e) => {
    if (currentThemeMode === THEMES.SYSTEM) {
      currentTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
      console.log('[ThemeManager] System theme changed to:', currentTheme);
      applyThemeToDOM(currentTheme);
      notifyListeners();
    }
  };
  
  // Add event listener
  if (darkModeMediaQuery.addEventListener) {
    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
  } else if (darkModeMediaQuery.addListener) {
    darkModeMediaQuery.addListener(handleSystemThemeChange);
  }
};

// Save theme preference
const saveThemePreference = async (themeMode) => {
  try {
    console.log('[ThemeManager] Saving theme preference:', themeMode);
    await storageHelper.setItem(THEME_KEY, themeMode);
  } catch (error) {
    console.error('[ThemeManager] Error saving theme preference:', error);
  }
};

// Set theme mode (light, dark, or system)
const setThemeMode = async (themeMode) => {
  if (!Object.values(THEMES).includes(themeMode)) {
    console.error('[ThemeManager] Invalid theme mode:', themeMode);
    return currentTheme;
  }
  
  console.log('[ThemeManager] Setting theme mode to:', themeMode);
  currentThemeMode = themeMode;
  
  // Determine the actual theme
  if (themeMode === THEMES.SYSTEM) {
    currentTheme = getSystemTheme();
  } else {
    currentTheme = themeMode;
  }
  
  // Apply theme to DOM for web
  if (Platform.OS === 'web' && isBrowser()) {
    applyThemeToDOM(currentTheme);
  }
  
  // Save the preference
  await saveThemePreference(themeMode);
  
  // Notify listeners
  notifyListeners();
  
  return currentTheme;
};

// Toggle between light and dark
const toggleTheme = async () => {
  const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  console.log('[ThemeManager] Toggling theme to:', newTheme);
  
  // Set and save the new theme
  await setThemeMode(newTheme);
  
  return currentTheme;
};

// Get current theme
const getTheme = () => {
  if (!isInitialized) {
    // If not initialized yet, trigger initialization
    if (Platform.OS !== 'web' || isBrowser()) {
      initialize();
    }
    return THEMES.LIGHT; // Return a safe default for initial render
  }
  return currentTheme;
};

// Get current theme mode
const getThemeMode = () => {
  if (!isInitialized) {
    if (Platform.OS !== 'web' || isBrowser()) {
      initialize();
    }
    return THEMES.SYSTEM; // Default to system if not initialized
  }
  return currentThemeMode;
};

// Add a listener for theme changes
const addThemeListener = (listener) => {
  listeners.add(listener);
  
  // Ensure initialization
  if (!isInitialized && (Platform.OS !== 'web' || isBrowser())) {
    initialize();
  }
  
  // Return cleanup function
  return () => {
    listeners.delete(listener);
  };
};

// Start initialization immediately, but only if we're in a browser environment
// for web or in a native environment
if (Platform.OS !== 'web' || isBrowser()) {
  initialize();
}

// Export the theme manager functions
export default {
  initialize,
  getTheme,
  getThemeMode,
  setThemeMode,
  toggleTheme,
  addThemeListener,
  THEMES
};