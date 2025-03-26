import { useTheme } from '../context/ThemeContext';

// Simple hook to get current theme for use with Colors object
export function useColorScheme() {
  const { theme } = useTheme();
  return theme;
}