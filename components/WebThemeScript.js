import React from 'react';
import { Platform } from 'react-native';

// Script yang akan langsung dieksekusi saat halaman dimuat di web browser
// Ini akan mengatur tema awal sebelum React bahkan di-render
export function WebThemeScript() {
  // Hanya jalankan di web
  if (Platform.OS !== 'web') return null;

  const themeScript = `
    (function() {
      // Fungsi untuk mengatur tema
      function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      }

      // Periksa apakah pengguna sudah memilih tema sebelumnya
      var savedTheme = localStorage.getItem('app_theme');
      
      // Terapkan tema yang tersimpan, atau gunakan tema sistem jika belum ada
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        applyTheme(savedTheme);
      } else {
        // Gunakan preferensi sistem
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
      }

      // Kemungkinan untuk mengganti tema nantinya
      window.toggleTheme = function() {
        var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        var newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('app_theme', newTheme);
        applyTheme(newTheme);
        return newTheme; // Return tema baru untuk digunakan oleh React
      };

      // Fungsi untuk mengatur tema secara manual
      window.setTheme = function(theme) {
        if (theme === 'light' || theme === 'dark') {
          localStorage.setItem('app_theme', theme);
          applyTheme(theme);
        }
      };

      // Fungsi untuk mendapatkan tema saat ini
      window.getCurrentTheme = function() {
        return document.documentElement.getAttribute('data-theme') || 'light';
      };
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

// Buat CSS untuk tema gelap yang akan diterapkan ketika dark-theme class ada di body
export const WebThemeStyles = `
body.dark-theme {
  background-color: #121212;
  color: #FFFFFF;
}
`;

// Helper untuk menggunakan fungsi tema dari komponen React
export const useWebTheme = () => {
  if (Platform.OS !== 'web') {
    return {
      theme: 'light',
      toggleTheme: () => {},
      setTheme: () => {}
    };
  }

  return {
    theme: typeof window !== 'undefined' && window.getCurrentTheme 
      ? window.getCurrentTheme() 
      : 'light',
    
    toggleTheme: () => {
      if (typeof window !== 'undefined' && window.toggleTheme) {
        return window.toggleTheme();
      }
      return 'light';
    },
    
    setTheme: (theme) => {
      if (typeof window !== 'undefined' && window.setTheme) {
        window.setTheme(theme);
      }
    }
  };
};