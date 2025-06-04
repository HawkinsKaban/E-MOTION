import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Animated 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

// Image mapping for the 6 emotions
const EmotionImages = {
  'Happy': require('../assets/images/emotion/happy.png'),
  'Sad': require('../assets/images/emotion/sad.png'),
  'Angry': require('../assets/images/emotion/anger.png'),
  'Fear': require('../assets/images/emotion/fear.png'),
  'Disgust': require('../assets/images/emotion/disgust.png'),
  'Shock': require('../assets/images/emotion/shock.png')
};

export default function EmotionAnimationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  
  const [analysisData, setAnalysisData] = useState(null);
  
  // Animation values
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    loadAnalysisData();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
    
    // Auto navigate to results after animation (3 seconds)
    const timer = setTimeout(() => {
      navigateToResults();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const loadAnalysisData = async () => {
    try {
      const historyString = await AsyncStorage.getItem('analysisHistory');
      
      if (historyString) {
        const history = JSON.parse(historyString);
        const result = history.find(item => item.id === params.id);
        
        if (result) {
          setAnalysisData(result);
        }
      }
    } catch (error) {
      console.error('Error loading analysis data', error);
      // Navigate to results anyway if there's an error
      navigateToResults();
    }
  };
  
  const navigateToResults = () => {
    router.replace({
      pathname: '/result',
      params: { id: params.id }
    });
  };
  
  // If no data yet, show a basic loading screen
  if (!analysisData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.contentContainer}>
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }
  
  // Get the emotion image based on dominant emotion
  const emotionImage = EmotionImages[analysisData.dominantEmotion] || 
                      require('../assets/images/emotion/happy.png'); // Default fallback
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.contentContainer}>
        <Animated.View 
          style={[
            styles.emotionContainer,
            { 
              opacity: fadeIn,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image 
            source={emotionImage}
            style={styles.emotionImage}
            resizeMode="contain"
          />
          
          <ThemedText style={styles.emotionText}>
            {analysisData.dominantEmotion}
          </ThemedText>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emotionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emotionText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
  }
});