import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  Animated,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { PageHeader } from '../components/PageHeader';

export default function RecordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text });
  const cardColor = useThemeColor({ light: Colors.light.card, dark: Colors.dark.card });
  
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Animation for the microphone pulse effect
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  // Timer for recording duration
  useEffect(() => {
    let interval = null;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  // Pulse animation
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);
  
  useEffect(() => {
    // Request permissions when component mounts
    const getPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'E-MOTION needs microphone access to analyze your voice emotions.',
          [
            { 
              text: 'Go Back', 
              onPress: () => router.back(),
              style: 'cancel'
            },
            { 
              text: 'Try Again', 
              onPress: getPermissions
            }
          ]
        );
      }
    };
    
    getPermissions();
    
    // Configure audio session
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      // Reset states
      setRecordingDuration(0);
      setRecordingUri(null);
      
      // Set up recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };
  
  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setIsRecording(false);
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };
  
  const cancelRecording = () => {
    if (recording) {
      stopRecording();
    }
    setRecordingUri(null);
    setRecordingDuration(0);
  };
  
  const analyzeRecording = async () => {
    if (!recordingUri) return;
    
    setIsProcessing(true);
    
    try {
      // Here you would normally send the audio file to your backend API
      // For demo purposes, we'll simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to analysis screen
      router.push({
        pathname: '/analysis',
        params: { source: 'recording', uri: recordingUri }
      });
    } catch (error) {
      console.error('Failed to analyze recording', error);
      Alert.alert('Error', 'Failed to analyze recording');
      setIsProcessing(false);
    }
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={textColor} 
          />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>
          Record Voice
        </ThemedText>
        
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.contentContainer}>
        <ThemedView 
          style={styles.recordingCard} 
          lightColor={Colors.light.card} 
          darkColor={Colors.dark.card}
        >
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.recordingImage}
            resizeMode="contain"
          />
          
          <ThemedText style={styles.instructionText}>
            {isRecording 
              ? "Recording your voice..." 
              : recordingUri 
                ? "Voice recorded successfully"
                : "Press button to begin recording"}
          </ThemedText>
          
          {isRecording && (
            <ThemedText 
              lightColor="#FF4D4F" 
              darkColor="#FF4D4F" 
              style={styles.timeText}
            >
              {formatTime(recordingDuration)}
            </ThemedText>
          )}
          
          <Animated.View 
            style={[
              styles.micContainer, 
              { 
                transform: [{ scale: pulseAnim }],
                backgroundColor: isRecording 
                  ? Colors[colorScheme].error + '20'
                  : recordingUri
                    ? Colors[colorScheme].success + '20'
                    : Colors[colorScheme].tint + '20'
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.micButton,
                {
                  backgroundColor: isRecording 
                    ? Colors[colorScheme].error
                    : recordingUri
                      ? Colors[colorScheme].success
                      : Colors[colorScheme].tint
                }
              ]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isProcessing || (!!recordingUri && !isRecording)}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={32} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </Animated.View>
          
          {recordingUri && (
            <ThemedText 
              style={styles.durationText}
              lightColor={Colors.light.subtext}
              darkColor={Colors.dark.subtext}
            >
              Duration: {formatTime(recordingDuration)}
            </ThemedText>
          )}
        </ThemedView>
        
        {recordingUri && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.cancelButton,
                { borderColor: Colors[colorScheme].border }
              ]}
              onPress={cancelRecording}
              disabled={isProcessing}
            >
              <Ionicons 
                name="close" 
                size={20} 
                color={Colors[colorScheme].error} 
              />
              <ThemedText 
                style={styles.actionButtonText}
                lightColor={Colors[colorScheme].error}
                darkColor={Colors[colorScheme].error}
              >
                Cancel
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors[colorScheme].primaryButton }
              ]}
              onPress={analyzeRecording}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="analytics" size={20} color="#FFFFFF" />
                  <Text style={styles.analyzeButtonText}>Analyze</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
    minWidth: 40,
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  recordingCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  recordingImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  micContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
    marginTop: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    flex: 0.48,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});