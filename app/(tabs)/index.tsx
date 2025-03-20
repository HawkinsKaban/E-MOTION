import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useThemeColor } from '../../hooks/useThemeColor';
import Colors from '../../constants/Colors';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text });
  const subtextColor = useThemeColor({ light: Colors.light.subtext, dark: Colors.dark.subtext });
  const cardColor = useThemeColor({ light: Colors.light.card, dark: Colors.dark.card });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  
  useEffect(() => {
    checkLoginStatus();
    loadRecentAnalyses();
  }, []);
  
  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const storedUsername = await AsyncStorage.getItem('username');
      
      if (userToken) {
        setIsLoggedIn(true);
        setUsername(storedUsername || 'User');
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    }
  };
  
  const loadRecentAnalyses = async () => {
    try {
      const savedAnalyses = await AsyncStorage.getItem('analysisHistory');
      if (savedAnalyses) {
        const parsedAnalyses = JSON.parse(savedAnalyses);
        setRecentAnalyses(parsedAnalyses.slice(0, 3)); // Show only 3 most recent
      }
    } catch (error) {
      console.log('Error loading analyses:', error);
    }
  };
  
  const handleStartAnalysis = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    router.push('/record');
  };
  
  const handleUploadAudio = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    router.push('/upload');
  };
  
  const handleOpenProfile = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    router.push('/profile');
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.greeting}>
            {isLoggedIn ? `Hello, ${username}` : 'Hello there'}
          </ThemedText>
          <ThemedText lightColor={Colors.light.subtext} darkColor={Colors.dark.subtext} style={styles.subtitle}>
            Detect voice emotions with E-MOTION
          </ThemedText>
        </View>
        
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: cardColor }]}
          onPress={handleOpenProfile}
        >
          <Ionicons 
            name={isLoggedIn ? "person" : "log-in-outline"} 
            size={24} 
            color={Colors[colorScheme].tint} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.heroContainer}>
          <Image 
            source={require('../../assets/images/splash-icon.png')} 
            style={styles.heroImage}
            resizeMode="contain"
          />
          
          <ThemedView style={styles.actionCard} lightColor={Colors.light.card} darkColor={Colors.dark.card}>
            <ThemedText style={styles.actionTitle}>
              Analyze Your Voice Emotions
            </ThemedText>
            <ThemedText lightColor={Colors.light.subtext} darkColor={Colors.dark.subtext} style={styles.actionSubtitle}>
              Record or upload your voice to detect emotions
            </ThemedText>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: Colors[colorScheme].primaryButton }]}
                onPress={handleStartAnalysis}
              >
                <Ionicons name="mic" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Record</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { 
                    backgroundColor: Colors[colorScheme].secondaryButton,
                    borderColor: colorScheme === 'dark' ? '#3E3E3E' : '#E5E5E5',
                    borderWidth: 1,
                  }
                ]}
                onPress={handleUploadAudio}
              >
                <Ionicons 
                  name="cloud-upload-outline" 
                  size={24} 
                  color={Colors[colorScheme].secondaryButtonText} 
                />
                <Text 
                  style={[
                    styles.actionButtonText, 
                    { color: Colors[colorScheme].secondaryButtonText }
                  ]}
                >
                  Upload
                </Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
        
        {isLoggedIn && recentAnalyses.length > 0 && (
          <View style={styles.recentSection}>
            <ThemedText style={styles.sectionTitle}>Recent Analysis</ThemedText>
            
            <View style={styles.recentList}>
              {recentAnalyses.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.recentItem, { backgroundColor: cardColor }]}
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
                  
                  <View style={styles.recentItemContent}>
                    <ThemedText style={styles.recentItemTitle} numberOfLines={1}>
                      {item.title || 'Voice Analysis'}
                    </ThemedText>
                    <ThemedText lightColor={Colors.light.subtext} darkColor={Colors.dark.subtext} style={styles.recentItemDate}>
                      {new Date(item.timestamp).toLocaleString()}
                    </ThemedText>
                  </View>
                  
                  <Ionicons name="chevron-forward" size={20} color={subtextColor} />
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={[styles.viewAllButton, { borderColor: Colors[colorScheme].border }]}
                onPress={() => router.push('/explore')}
              >
                <ThemedText style={styles.viewAllText}>
                  View All History
                </ThemedText>
                <Ionicons name="arrow-forward" size={16} color={Colors[colorScheme].tint} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.infoSection}>
          <ThemedText style={styles.sectionTitle}>About E-MOTION</ThemedText>
          
          <ThemedView style={styles.infoCard} lightColor={Colors.light.card} darkColor={Colors.dark.card}>
            <ThemedText style={styles.infoTitle}>
              Voice Emotion Detection for Indonesian Population
            </ThemedText>
            
            <ThemedText lightColor={Colors.light.subtext} darkColor={Colors.dark.subtext} style={styles.infoText}>
              E-MOTION is an application that analyzes human emotions based on voice signals, 
              specially developed for the Indonesian population. The app uses advanced machine learning 
              to detect emotions like happiness, sadness, anger, and fear from voice recordings.
            </ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    padding: 20,
    alignItems: 'center',
  },
  heroImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  actionCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionSubtitle: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 0.48,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentList: {
    width: '100%',
  },
  recentItem: {
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
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  recentItemDate: {
    fontSize: 12,
    marginTop: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  viewAllText: {
    fontWeight: '500',
    marginRight: 8,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});