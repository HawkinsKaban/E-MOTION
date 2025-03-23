import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useThemeColor } from '../../hooks/useThemeColor';
import Colors from '../../constants/Colors';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const cardColor = useThemeColor({ light: Colors.light.card, dark: Colors.dark.card });
  const subtextColor = useThemeColor({ light: Colors.light.subtext, dark: Colors.dark.subtext });
  
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    checkLoginStatus();
    loadHistory();
  }, []);
  
  // Use useFocusEffect instead of router.addListener
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );
  
  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    }
  };
  
  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('analysisHistory');
      if (savedHistory) {
        setHistoryItems(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };
  
  const getEmotionIcon = (emotion) => {
    switch (emotion?.toLowerCase()) {
      case 'happy':
        return 'happy-outline';
      case 'sad':
        return 'sad-outline';
      case 'angry':
        return 'flame-outline';
      case 'fear':
        return 'warning-outline';
      default:
        return 'ellipsis-horizontal-outline';
    }
  };
  
  const getEmotionColor = (emotion) => {
    switch (emotion?.toLowerCase()) {
      case 'happy':
        return '#22C55E';
      case 'sad':
        return '#3B82F6';
      case 'angry':
        return '#EF4444';
      case 'fear':
        return '#F59E0B';
      default:
        return '#9CA3AF';
    }
  };
  
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.historyItem, { backgroundColor: cardColor }]}
      onPress={() => router.push({
        pathname: '/result',
        params: { id: item.id }
      })}
    >
      <View style={[styles.emotionIcon, { backgroundColor: getEmotionColor(item.dominantEmotion) + '20' }]}>
        <Ionicons 
          name={getEmotionIcon(item.dominantEmotion)} 
          size={24} 
          color={getEmotionColor(item.dominantEmotion)} 
        />
      </View>
      
      <View style={styles.historyItemContent}>
        <ThemedText style={styles.historyItemTitle} numberOfLines={1}>
          {item.title || 'Voice Analysis'}
        </ThemedText>
        <ThemedText lightColor={Colors.light.subtext} darkColor={Colors.dark.subtext} style={styles.historyItemDate}>
          {new Date(item.timestamp).toLocaleString()}
        </ThemedText>
      </View>
      
      <View style={styles.emotionTag}>
        <ThemedText style={[styles.emotionTagText, { color: getEmotionColor(item.dominantEmotion) }]}>
          {item.dominantEmotion || 'Unknown'}
        </ThemedText>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={subtextColor} />
    </TouchableOpacity>
  );
  
  const EmptyListComponent = () => (
    <ThemedView style={styles.emptyContainer}>
      <Ionicons name="time" size={60} color={subtextColor} />
      <ThemedText style={styles.emptyTitle}>No history yet</ThemedText>
      <ThemedText lightColor={Colors.light.subtext} darkColor={Colors.dark.subtext} style={styles.emptyText}>
        {isLoggedIn 
          ? "Your voice analysis history will appear here" 
          : "Please login to view your history"}
      </ThemedText>
      
      {!isLoggedIn && (
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: Colors[colorScheme].primaryButton }]}
          onPress={() => router.push('/login')}
        >
          <ThemedText style={styles.loginButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
            Login
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <ThemedText style={styles.title}>Analysis History</ThemedText>
        
        {isLoggedIn && historyItems.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={async () => {
              await AsyncStorage.removeItem('analysisHistory');
              setHistoryItems([]);
            }}
          >
            <ThemedText lightColor={Colors.light.error} darkColor={Colors.dark.error}>
              Clear
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={historyItems}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyListComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
    flexGrow: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  emotionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  historyItemDate: {
    fontSize: 12,
    marginTop: 4,
  },
  emotionTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
  },
  emotionTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});