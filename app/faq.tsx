import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { PageHeader } from '../components/PageHeader';

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  const colorScheme = useColorScheme();
  const borderColor = useThemeColor({ light: Colors.light.border, dark: Colors.dark.border });

  return (
    <View style={[styles.faqItem, { borderBottomColor: borderColor }]}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.questionText}>{question}</ThemedText>
        <Ionicons
          name={isOpen ? "close-outline" : "add-outline"}
          size={24}
          color={Colors[colorScheme].tint}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.answerContainer}>
          <ThemedText
            style={styles.answerText}
            lightColor={Colors.light.subtext}
            darkColor={Colors.dark.subtext}
          >
            {answer}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default function FAQScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });

  // State to track which FAQ is open
  const [openFAQ, setOpenFAQ] = useState(0);

  // Toggle FAQ open/close
  const toggleFAQ = (index) => {
    if (openFAQ === index) {
      setOpenFAQ(null); // Close if already open
    } else {
      setOpenFAQ(index); // Open the clicked one
    }
  };

  // FAQ data
  const faqData = [
    {
      question: "How does E-MOTION detect emotions from voice?",
      answer: "E-MOTION uses advanced machine learning algorithms to analyze various acoustic features in your voice such as pitch, rhythm, energy, and spectral characteristics. These features are processed through our proprietary neural network models that have been trained on thousands of voice samples specifically from Indonesian speakers to accurately identify emotional patterns."
    },
    {
      question: "What type of emotions can E-MOTION identify?",
      answer: "The application can detect six basic emotions: happiness, sadness, anger, fear, disgust, and surprise. Our system can also identify neutral states and can provide insights into the intensity levels of each detected emotion."
    },
    {
      question: "Can I upload pre-recorded audio files for emotion analysis?",
      answer: "Yes, E-MOTION supports uploading pre-recorded audio files for analysis. You can upload audio files from your device storage and our system will process them just like real-time recordings to detect emotions."
    },
    {
      question: "Is my voice data stored or shared with third parties?",
      answer: "Your privacy is important to us. Voice recordings are processed on your device when possible, and any data sent to our servers is encrypted. We do not share your voice data with third parties without your explicit consent. You can manage data sharing settings in your profile."
    },
    {
      question: "How accurate is the emotion detection feature?",
      answer: "Our emotion detection system achieves over 85% accuracy in controlled environments. Performance may vary based on recording quality, background noise, and clarity of speech. The system is specifically calibrated for Indonesian speech patterns and accents to ensure optimal accuracy for Indonesian users."
    },
    {
      question: "What audio formats are supported for upload?",
      answer: "E-MOTION supports common audio formats including MP3, WAV, M4A, and AAC. For optimal results, we recommend using files with clear audio, minimal background noise, and a duration between 10 seconds and 2 minutes."
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="light" />
      
      {/* Tinted Header */}
      <View style={[styles.customHeader, { backgroundColor: Colors[colorScheme].tint }]}>
        <PageHeader 
          title="FAQ" 
          showBackButton={true}
          onBack={() => router.back()}
          rightElement={<View style={styles.headerRight} />}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.mainTitle}>
          Frequently Asked Questions
        </ThemedText>

        <View style={styles.faqContainer}>
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openFAQ === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    width: '100%',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  faqContainer: {
    marginBottom: 20,
  },
  faqItem: {
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    paddingRight: 16,
  },
  answerContainer: {
    marginTop: 12,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
  }
});