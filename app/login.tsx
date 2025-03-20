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
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text });
  const inputBackground = useThemeColor({ light: '#F5F5F5', dark: '#333333' });
  const placeholderColor = useThemeColor({ light: '#AAAAAA', dark: '#666666' });
  const borderColor = useThemeColor({ light: Colors.light.border, dark: Colors.dark.border });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would normally connect to your backend API
      // For demo purposes, simulating a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save login info (in a real app, you would save a token from your API)
      await AsyncStorage.setItem('userToken', 'demo-token');
      await AsyncStorage.setItem('username', email.split('@')[0]);
      
      setIsLoading(false);
      router.replace('/');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor }]}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/splash-icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.appName}>E-MOTION</ThemedText>
          <ThemedText 
            lightColor={Colors.light.subtext} 
            darkColor={Colors.dark.subtext} 
            style={styles.appTagline}
          >
            Voice Emotion Detection
          </ThemedText>
        </View>
        
        <ThemedView style={styles.formContainer}>
          <ThemedText style={styles.headerText}>Login</ThemedText>
          <ThemedText 
            lightColor={Colors.light.subtext} 
            darkColor={Colors.dark.subtext} 
            style={styles.subtitleText}
          >
            Please sign in to continue
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
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Reset Password', 'Feature coming soon!')}
            >
              <ThemedText 
                lightColor={Colors.light.tint} 
                darkColor={Colors.dark.tint} 
                style={styles.forgotPasswordText}
              >
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              { backgroundColor: Colors[colorScheme].primaryButton },
              (!email || !password) && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <ThemedText style={styles.loginButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                Login
              </ThemedText>
            )}
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
            <ThemedText 
              lightColor={Colors.light.subtext} 
              darkColor={Colors.dark.subtext} 
              style={styles.dividerText}
            >
              or
            </ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.registerButton, 
              { 
                backgroundColor: Colors[colorScheme].secondaryButton,
                borderColor: borderColor,
                borderWidth: 1,
              }
            ]}
            onPress={() => router.push('/register')}
          >
            <ThemedText 
              style={styles.registerButtonText} 
              lightColor={Colors[colorScheme].secondaryButtonText} 
              darkColor={Colors[colorScheme].secondaryButtonText}
            >
              Create New Account
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appTagline: {
    fontSize: 16,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    marginBottom: 24,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});