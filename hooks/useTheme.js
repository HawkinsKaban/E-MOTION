import { useContext } from 'react';
import { ThemeContext } from '../App';

// Hook sederhana untuk akses tema dari context
export function useTheme() {
  return useContext(ThemeContext);
}