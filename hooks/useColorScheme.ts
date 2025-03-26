import { useTheme } from './useTheme';

export function useColorScheme() {
  const { theme } = useTheme();
  return theme;
}