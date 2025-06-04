import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { PageHeader } from '../components/PageHeader';

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text });
  const inputBackground = useThemeColor({ light: '#F5F5F5', dark: '#333333' });
  const placeholderColor = useThemeColor({ light: '#AAAAAA', dark: '#666666' });
  const borderColor = useThemeColor({ light: Colors.light.border, dark: Colors.dark.border });
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  
  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would normally connect to your backend API
      // For demo purposes, simulating a successful registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save registration info (in a real app, you would save a token from your API)
      await AsyncStorage.setItem('userToken', 'demo-token');
      await AsyncStorage.setItem('username', fullName);
      
      setIsLoading(false);
      
      // Show success message
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully!',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/')
          }
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Registration Failed', 'Unable to create account. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <PageHeader title="Create Account" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <ThemedView style={styles.formContainer}>
            <ThemedText 
              lightColor={Colors.light.subtext} 
              darkColor={Colors.dark.subtext} 
              style={styles.subtitleText}
            >
              Sign up to get started
            </ThemedText>
            
            <View style={styles.inputContainer}>
              <View 
                style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: inputBackground,
                    borderColor: borderColor
                  }
                ]}
              >
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={placeholderColor} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Full Name"
                  placeholderTextColor={placeholderColor}
                  autoCapitalize="words"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              
              <View 
                style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: inputBackground,
                    borderColor: borderColor
                  }
                ]}
              >
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={placeholderColor} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Email Address"
                  placeholderTextColor={placeholderColor}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <View 
                style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: inputBackground,
                    borderColor: borderColor
                  }
                ]}
              >
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={placeholderColor} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Password"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={secureTextEntry}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'} 
                    size={20} 
                    color={placeholderColor} 
                  />
                </TouchableOpacity>
              </View>
              
              <View 
                style={[
                  styles.inputWrapper, 
                  { 
                    backgroundColor: inputBackground,
                    borderColor: borderColor
                  }
                ]}
              >
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={placeholderColor} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={secureConfirmTextEntry}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                  onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={secureConfirmTextEntry ? 'eye-outline' : 'eye-off-outline'} 
                    size={20} 
                    color={placeholderColor} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.registerButton, 
                { backgroundColor: Colors[colorScheme].primaryButton },
                (!fullName || !email || !password || !confirmPassword) && styles.registerButtonDisabled
              ]}
              onPress={handleRegister}
              disabled={isLoading || !fullName || !email || !password || !confirmPassword}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText style={styles.registerButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Sign Up
                </ThemedText>
              )}
            </TouchableOpacity>
            
            <View style={styles.loginLinkContainer}>
              <ThemedText 
                lightColor={Colors.light.subtext} 
                darkColor={Colors.dark.subtext} 
                style={styles.loginLinkText}
              >
                Already have an account?
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <ThemedText 
                  lightColor={Colors.light.tint} 
                  darkColor={Colors.dark.tint} 
                  style={styles.loginLink}
                >
                  {' '}Login
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
  },
  logo: {
    width: 80,  // Reduced from 120
    height: 80, // Reduced from 120
    alignSelf: 'center',
    marginVertical: 16, // Slightly reduced margin
  },
  formContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  subtitleText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 56,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});