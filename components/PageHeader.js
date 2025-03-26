// components/PageHeader.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';

export function PageHeader({ title, showBackButton = true, rightElement = null, onBack }) {
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  
  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={textColor} 
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderButton} />
      )}
      
      <ThemedText style={styles.headerTitle}>
        {title}
      </ThemedText>
      
      {rightElement ? rightElement : <View style={styles.placeholderButton} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'flex-start',
  },
  placeholderButton: {
    width: 40,
  },
});