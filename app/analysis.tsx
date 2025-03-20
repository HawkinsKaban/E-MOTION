import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Animated, 
  SafeAreaView,
  Dimensions,
  BackHandler
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

const { width } = Dimensions.get('window');

export default function AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const rotateInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const steps = [
    "Initializing analysis...",
    "Processing audio...",
    "Extracting audio features...",
    "Analyzing voice patterns...",
    "Detecting emotions...",
    "Generating results..."
  ];
  
  useEffect(() => {
    // Start rotation animation
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
    
    // Prevent going back during analysis
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );
    
    // Simulate analysis process
    const analyzeAudio = async () => {
      // Simulate preprocessing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(1);
      setProgress(0.2);
      
      // Simulate feature extraction
      await new Promise(resolve => setTimeout(resolve, 1200));
      setCurrentStep(2);
      setProgress(0.4);
      
      // Simulate pattern analysis
      await new Promise(resolve => setTimeout(resolve, 1300));
      setCurrentStep(3);
      setProgress(0.6);
      
      // Simulate emotion detection
      await new Promise(resolve => setTimeout(resolve, 1400));
      setCurrentStep(4);
      setProgress(0.8);
      
      // Simulate result generation
      await new Promise(resolve => setTimeout(resolve, 1600));
      setCurrentStep(5);
      setProgress(1);
      
      // Generate mock analysis results
      const emotions = ['Happy', 'Sad', 'Angry', 'Fear'];
      const dominantEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      const emotionData = {
        'Happy': Math.random() * 100,
        'Sad': Math.random() * 100,
        'Angry': Math.random() * 100,
        'Fear': Math.random() * 100
      };
      
      // Normalize to sum to 100%
      const sum = Object.values(emotionData).reduce((a, b) => a + b, 0);
      Object.keys(emotionData).forEach(key => {
        emotionData[key] = (emotionData[key] / sum) * 100;
      });
      
      // Ensure dominant emotion has highest value
      const maxVal = Math.max(...Object.values(emotionData));
      emotionData[dominantEmotion] = maxVal + 10;
      
      // Normalize again
      const newSum = Object.values(emotionData).reduce((a, b) => a + b, 0);
      Object.keys(emotionData).forEach(key => {
        emotionData[key] = parseFloat((emotionData[key] / newSum * 100).toFixed(1));
      });
      
      // Save results
      const analysisResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        source: params.source,
        uri: params.uri,
        title: params.source === 'upload' ? 'Uploaded Recording' : 'Voice Recording',
        dominantEmotion: dominantEmotion,
        emotionData: emotionData
      };
      
      // Save to history
      try {
        const existingHistory = await AsyncStorage.getItem('analysisHistory');
        let historyItems = [];
        
        if (existingHistory) {
          historyItems = JSON.parse(existingHistory);
        }
        
        historyItems.unshift(analysisResult);
        
        // Keep only the last 50 items
        if (historyItems.length > 50) {
          historyItems = historyItems.slice(0, 50);
        }
        
        await AsyncStorage.setItem('analysisHistory', JSON.stringify(historyItems));
      } catch (error) {
        console.error('Error saving analysis to history', error);
      }
      
      // Navigate to results
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.replace({
        pathname: '/result',
        params: { id: analysisResult.id }
      });
    };
    
    analyzeAudio();
    
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.contentContainer}>
        <Animated.View 
          style={[
            styles.logoContainer,
            { transform: [{ rotate: rotateInterpolation }] }
          ]}
        >
          <ThemedView 
            style={styles.logoBackground}
            lightColor={Colors.light.card} 
            darkColor={Colors.dark.card}
          >
            <ThemedView 
              style={styles.logoInner}
              lightColor={Colors.light.tint} 
              darkColor={Colors.dark.tint}
            />
          </ThemedView>
        </Animated.View>
        
        <ThemedText style={styles.analysisTitle}>
          Analyzing Voice
        </ThemedText>
        
        <ThemedText 
          style={styles.stepText}
          lightColor={Colors.light.subtext} 
          darkColor={Colors.dark.subtext}
        >
          {steps[currentStep]}
        </ThemedText>
        
        <View style={styles.progressContainer}>
          <ThemedView 
            style={[styles.progressBar, { width: `${progress * 100}%` }]}
            lightColor={Colors.light.tint} 
            darkColor={Colors.dark.tint}
          />
        </View>
        
        <ThemedText 
          style={styles.infoText}
          lightColor={Colors.light.subtext} 
          darkColor={Colors.dark.subtext}
        >
          Please don't close the app during analysis
        </ThemedText>
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
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  analysisTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  progressContainer: {
    width: width - 80,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  },
});