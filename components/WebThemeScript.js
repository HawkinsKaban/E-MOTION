import React from 'react';
import { Platform } from 'react-native';
import { THEME_STORAGE_KEY } from '../context/ThemeContext';

// Script to be executed when the page loads in web browser
export function WebThemeScript() {
  // Only run on web
  if (Platform.OS !== 'web') return null;
  
  // The script will be injected into the head of the HTML document
  const themeScript = `
    (function() {
      console.log('[WebThemeScript] Initializing theme script');
      
      // Function to apply theme to document
      function applyTheme(theme) {
        console.log('[WebThemeScript] Applying theme:', theme);
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
        document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
      }

      // Check if user has previously selected a theme
      var savedTheme = localStorage.getItem('${THEME_STORAGE_KEY}');
      console.log('[WebThemeScript] Saved theme from localStorage:', savedTheme);
      
      // Apply saved theme, or use system theme if none exists
      if (savedTheme === 'light' || savedTheme === 'dark') {
        applyTheme(savedTheme);
      } else if (savedTheme === 'system') {
        // For 'system', check system preference
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var systemTheme = prefersDark ? 'dark' : 'light';
        console.log('[WebThemeScript] Using system theme:', systemTheme);
        applyTheme(systemTheme);
      } else {
        // Use system preference by default
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var defaultTheme = prefersDark ? 'dark' : 'light';
        console.log('[WebThemeScript] No saved theme, using system default:', defaultTheme);
        applyTheme(defaultTheme);
      }

      // Function to toggle theme
      window.toggleTheme = function() {
        var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        var newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('[WebThemeScript] Toggling theme to:', newTheme);
        localStorage.setItem('${THEME_STORAGE_KEY}', newTheme);
        applyTheme(newTheme);
        return newTheme;
      };

      // Function to manually set the theme
      window.setTheme = function(theme) {
        console.log('[WebThemeScript] Setting theme to:', theme);
        if (theme === 'light' || theme === 'dark') {
          localStorage.setItem('${THEME_STORAGE_KEY}', theme);
          applyTheme(theme);
        } else if (theme === 'system') {
          localStorage.setItem('${THEME_STORAGE_KEY}', 'system');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var systemTheme = prefersDark ? 'dark' : 'light';
          console.log('[WebThemeScript] System theme is:', systemTheme);
          applyTheme(systemTheme);
        }
      };

      // Function to get current theme
      window.getCurrentTheme = function() {
        return document.documentElement.getAttribute('data-theme') || 'light';
      };
      
      // Listen for system theme changes
      var darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      var handleSystemThemeChange = function(e) {
        var savedTheme = localStorage.getItem('${THEME_STORAGE_KEY}');
        console.log('[WebThemeScript] System theme changed, saved theme is:', savedTheme);
        
        if (savedTheme === 'system') {
          var newTheme = e.matches ? 'dark' : 'light';
          console.log('[WebThemeScript] Applying system theme change:', newTheme);
          applyTheme(newTheme);
        }
      };
      
      // Add event listener for system theme changes
      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
      } else if (darkModeMediaQuery.addListener) {
        darkModeMediaQuery.addListener(handleSystemThemeChange);
      }
      
      console.log('[WebThemeScript] Theme script initialized');
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

// CSS for dark theme
export const WebThemeStyles = `
body.dark-theme {
  background-color: #121212;
  color: #FFFFFF;
}

[data-theme='dark'] {
  color-scheme: dark;
}

[data-theme='light'] {
  color-scheme: light;
}
`;