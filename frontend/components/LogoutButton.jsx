import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { ThemedText } from './ThemedText';
import { logout } from '../utils/authManager';

export function LogoutButton({ style, textStyle, iconSize = 20, showText = true }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              // Menggunakan fungsi logout dari authManager
              const success = await logout();
              
              if (success) {
                // Tunggu sebentar untuk animasi loading
                setTimeout(() => {
                  setIsLoading(false);
                  // Reset ke layar beranda
                  router.replace('/');
                }, 500);
              } else {
                throw new Error('Logout failed');
              }
            } catch (error) {
              console.log('Error during logout:', error);
              setIsLoading(false);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.logoutButton,
        { 
          backgroundColor: Colors[colorScheme].error + '20',
          borderColor: Colors[colorScheme].error + '40',
        },
        style
      ]}
      onPress={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors[colorScheme].error} />
      ) : (
        <>
          <Ionicons 
            name="log-out-outline" 
            size={iconSize} 
            color={Colors[colorScheme].error} 
          />
          
          {showText && (
            <ThemedText 
              style={[styles.logoutButtonText, textStyle]}
              lightColor={Colors[colorScheme].error} 
              darkColor={Colors[colorScheme].error}
            >
              Logout
            </ThemedText>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  }
});