import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Share,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

const { width } = Dimensions.get('window');

// Image mapping for the 6 emotions
const EmotionImages = {
  'Happy': require('../assets/images/emotion/happy.png'),
  'Sad': require('../assets/images/emotion/sad.png'),
  'Angry': require('../assets/images/emotion/anger.png'),
  'Fear': require('../assets/images/emotion/fear.png'),
  'Disgust': require('../assets/images/emotion/disgust.png'),
  'Shock': require('../assets/images/emotion/shock.png')
};

// Emotion info object - updated for all 6 emotions
const EmotionInfo = {
  'Happy': {
    description: 'Your voice indicates happiness and positive emotions. Your tone is upbeat and energetic, showing good mood and enthusiasm.',
    icon: 'happy-outline',
    color: '#22C55E'
  },
  'Sad': {
    description: 'Your voice suggests sadness or melancholy. The tone is lower in energy and pitch, possibly indicating feelings of loss, disappointment, or unhappiness.',
    icon: 'sad-outline',
    color: '#3B82F6'
  },
  'Angry': {
    description: 'Your voice suggests anger or frustration. The pattern shows higher intensity and sharper tonal changes, possibly indicating irritation or annoyance.',
    icon: 'flame-outline',
    color: '#EF4444'
  },
  'Fear': {
    description: 'Your voice indicates anxiety or fear. The pattern shows tension and unsteadiness in pitch, possibly indicating worry or nervousness.',
    icon: 'warning-outline',
    color: '#F59E0B'
  },
  'Disgust': {
    description: 'Your voice suggests feelings of disgust or revulsion. The pattern shows a distinctive tone often associated with avoidance or rejection responses.',
    icon: 'remove-circle-outline',
    color: '#8B5CF6'
  },
  'Shock': {
    description: 'Your voice indicates surprise or shock. The pattern shows sudden changes in pitch and intensity, characteristic of an unexpected reaction.',
    icon: 'flash-outline',
    color: '#EC4899'
  }
};

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text });
  const cardColor = useThemeColor({ light: Colors.light.card, dark: Colors.dark.card });
  
  const [analysisData, setAnalysisData] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    loadAnalysisData();
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
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
      Alert.alert('Error', 'Failed to load analysis results.');
    }
  };
  
  const playRecording = async () => {
    if (!analysisData?.uri) return;
    
    try {
      if (sound) {
        // If sound is already loaded, play it
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Load the sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: analysisData.uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound', error);
      Alert.alert('Error', 'Failed to play recording.');
    }
  };
  
  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };
  
  const shareResults = async () => {
    if (!analysisData) return;
    
    try {
      await Share.share({
        message: `I analyzed my voice emotions with E-MOTION and found that I'm feeling predominantly ${analysisData.dominantEmotion}!`,
        title: 'My Voice Emotion Analysis'
      });
    } catch (error) {
      console.error('Error sharing results', error);
    }
  };
  
  if (!analysisData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading results...</ThemedText>
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
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/')}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={textColor} 
          />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>
          Analysis Results
        </ThemedText>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={shareResults}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons 
            name="share-outline" 
            size={24} 
            color={textColor} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView 
          style={styles.mainResultCard}
          lightColor={Colors.light.card} 
          darkColor={Colors.dark.card}
        >
          <View style={styles.resultHeader}>
            <ThemedText style={styles.resultTitle}>
              Voice Emotion Analysis
            </ThemedText>
            <ThemedText 
              style={styles.resultDate}
              lightColor={Colors.light.subtext} 
              darkColor={Colors.dark.subtext}
            >
              {new Date(analysisData.timestamp).toLocaleString()}
            </ThemedText>
          </View>
          
          <View style={styles.emotionVisualContainer}>
            <Image
              source={emotionImage}
              style={styles.emotionImage}
              resizeMode="contain"
            />
          </View>
          
          <View 
            style={[
              styles.dominantEmotionContainer, 
              { backgroundColor: EmotionInfo[analysisData.dominantEmotion]?.color + '20' }
            ]}
          >
            <View style={styles.emotionIconContainer}>
              <Ionicons 
                name={EmotionInfo[analysisData.dominantEmotion]?.icon} 
                size={48} 
                color={EmotionInfo[analysisData.dominantEmotion]?.color} 
              />
            </View>
            
            <View style={styles.emotionTextContainer}>
              <ThemedText style={styles.dominantEmotionTitle}>
                Dominant Emotion: {analysisData.dominantEmotion}
              </ThemedText>
              
              <ThemedText 
                style={styles.dominantEmotionDescription}
                lightColor={Colors.light.subtext} 
                darkColor={Colors.dark.subtext}
              >
                {EmotionInfo[analysisData.dominantEmotion]?.description}
              </ThemedText>
            </View>
          </View>
          
          {analysisData.uri && (
            <TouchableOpacity 
              style={[
                styles.playButton, 
                { 
                  backgroundColor: isPlaying ? Colors[colorScheme].error : Colors[colorScheme].tint,
                  opacity: isPlaying ? 0.9 : 1
                }
              ]}
              onPress={playRecording}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={20} 
                color="#FFFFFF" 
              />
              <ThemedText style={styles.playButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                {isPlaying ? "Pause Recording" : "Play Recording"}
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
        
        <ThemedView 
          style={styles.infoCard}
          lightColor={Colors.light.card} 
          darkColor={Colors.dark.card}
        >
          <ThemedText style={styles.infoTitle}>
            About Voice Emotion Analysis
          </ThemedText>
          
          <ThemedText 
            style={styles.infoText}
            lightColor={Colors.light.subtext} 
            darkColor={Colors.dark.subtext}
          >
            E-MOTION uses advanced machine learning algorithms to analyze voice patterns and detect emotions. 
            The analysis is based on various acoustic features extracted from your voice, including pitch, 
            energy, rhythm, and spectral characteristics.
          </ThemedText>
          
          <ThemedText 
            style={[styles.infoText, { marginTop: 12 }]}
            lightColor={Colors.light.subtext} 
            darkColor={Colors.dark.subtext}
          >
            This technology is specifically calibrated for the Indonesian population, considering 
            cultural and linguistic factors that influence emotional expression through voice.
          </ThemedText>
          
          <ThemedText 
            style={[styles.disclaimerText, { marginTop: 16 }]}
            lightColor={Colors.light.error} 
            darkColor={Colors.dark.error}
          >
            Disclaimer: This analysis is for informational purposes only and should not be used 
            for clinical diagnosis. Results may vary based on recording quality and environmental factors.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
    minWidth: 40,
  },
  shareButton: {
    padding: 8,
    minWidth: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  mainResultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  resultHeader: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  resultDate: {
    fontSize: 14,
    marginTop: 4,
  },
  emotionVisualContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emotionImage: {
    width: 120,
    height: 120,
  },
  dominantEmotionContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  emotionIconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  emotionTextContainer: {
    flex: 1,
  },
  dominantEmotionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  dominantEmotionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  disclaimerText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});