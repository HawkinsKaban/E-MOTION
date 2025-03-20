import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

export default function UploadScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text });
  const cardColor = useThemeColor({ light: Colors.light.card, dark: Colors.dark.card });
  const borderColor = useThemeColor({ light: Colors.light.border, dark: Colors.dark.border });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'audio/mpeg', 
          'audio/mp3', 
          'audio/mp4', 
          'audio/wav', 
          'audio/x-wav', 
          'audio/x-m4a',
          'audio/*'
        ],
        copyToCacheDirectory: true
      });
      
      if (result.canceled) {
        return;
      }
      
      // Check file size (max 10MB)
      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
      if (fileInfo.size > 10 * 1024 * 1024) {
        Alert.alert(
          'File Too Large', 
          'Please select an audio file smaller than 10MB.'
        );
        return;
      }
      
      setSelectedFile(result.assets[0]);
    } catch (error) {
      console.error('Error picking document', error);
      Alert.alert('Error', 'Failed to select audio file.');
    }
  };
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  const analyzeFile = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Here you would normally send the audio file to your backend API
      // For demo purposes, we'll simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to analysis screen
      router.push({
        pathname: '/analysis',
        params: { source: 'upload', uri: selectedFile.uri }
      });
    } catch (error) {
      console.error('Failed to analyze file', error);
      Alert.alert('Error', 'Failed to analyze audio file.');
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isProcessing}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={textColor} 
          />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>
          Upload Voice
        </ThemedText>
        
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.contentContainer}>
        <ThemedView 
          style={styles.uploadCard} 
          lightColor={Colors.light.card} 
          darkColor={Colors.dark.card}
        >
          <Image 
            source={require('../assets/images/splash-icon.png')} 
            style={styles.uploadImage}
            resizeMode="contain"
          />
          
          <ThemedText style={styles.instructionText}>
            {selectedFile 
              ? "File selected successfully" 
              : "Upload an audio file to analyze emotions"}
          </ThemedText>
          
          <ThemedText 
            lightColor={Colors.light.subtext} 
            darkColor={Colors.dark.subtext} 
            style={styles.subtitleText}
          >
            {selectedFile 
              ? "" 
              : "Supported formats: MP3, WAV, M4A (Max. 10MB)"}
          </ThemedText>
          
          {selectedFile ? (
            <View style={styles.fileInfoContainer}>
              <View style={[styles.fileTypeIcon, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
                <Ionicons name="musical-note" size={24} color={Colors[colorScheme].tint} />
              </View>
              
              <View style={styles.fileDetails}>
                <ThemedText style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name}
                </ThemedText>
                
                <ThemedText 
                  lightColor={Colors.light.subtext} 
                  darkColor={Colors.dark.subtext} 
                  style={styles.fileSize}
                >
                  {formatBytes(selectedFile.size)}
                </ThemedText>
              </View>
              
              <TouchableOpacity 
                style={styles.removeFileButton}
                onPress={() => setSelectedFile(null)}
                disabled={isProcessing}
              >
                <Ionicons name="close-circle" size={24} color={Colors[colorScheme].error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[
                styles.uploadButton, 
                { 
                  borderColor: borderColor,
                  borderStyle: 'dashed', 
                }
              ]}
              onPress={pickAudioFile}
            >
              <Ionicons 
                name="cloud-upload-outline" 
                size={40} 
                color={Colors[colorScheme].tint} 
              />
              <ThemedText 
                style={styles.uploadButtonText}
                lightColor={Colors[colorScheme].tint}
                darkColor={Colors[colorScheme].tint}
              >
                Select Audio File
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
        
        {selectedFile && (
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              { backgroundColor: Colors[colorScheme].primaryButton }
            ]}
            onPress={analyzeFile}
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  uploadCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  uploadImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  uploadButton: {
    width: '100%',
    height: 160,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
  },
  fileTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
  },
  removeFileButton: {
    padding: 8,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    marginTop: 24,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});