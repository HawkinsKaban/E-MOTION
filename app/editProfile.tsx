import React, { useState, useEffect } from 'react';
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
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text });
  const inputBackground = useThemeColor({ light: '#F5F5F5', dark: '#333333' });
  const placeholderColor = useThemeColor({ light: '#AAAAAA', dark: '#666666' });
  const borderColor = useThemeColor({ light: Colors.light.border, dark: Colors.dark.border });

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [gender, setGender] = useState('Male');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userGender = await AsyncStorage.getItem('userGender');
      const userBirthDate = await AsyncStorage.getItem('userBirthDate');
      const userProfileImage = await AsyncStorage.getItem('userProfileImage');

      if (username) setName(username);
      if (userEmail) setEmail(userEmail);
      if (userGender) setGender(userGender);
      if (userBirthDate) setBirthDate(new Date(userBirthDate));
      if (userProfileImage) setProfileImage(userProfileImage);

      // Password is not loaded for security reasons
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const toggleGenderPicker = () => {
    setShowGenderPicker(!showGenderPicker);
  };

  const selectGender = (selectedGender) => {
    setGender(selectedGender);
    setShowGenderPicker(false);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setIsLoading(true);

    try {
      // Save user data
      await AsyncStorage.setItem('username', name);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userGender', gender);
      await AsyncStorage.setItem('userBirthDate', birthDate.toISOString());

      if (profileImage) {
        await AsyncStorage.setItem('userProfileImage', profileImage);
      }

      // Only update password if a new one was provided
      if (password) {
        await AsyncStorage.setItem('userPassword', password);
      }

      setIsLoading(false);

      Alert.alert(
        'Success',
        'Profile updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={textColor}
          />
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>
          Edit Profile
        </ThemedText>

        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[
                    styles.profileImagePlaceholder,
                    { backgroundColor: Colors[colorScheme].tint + '40' }
                  ]}
                >
                  <ThemedText style={styles.profileImagePlaceholderText}>
                    {name ? name.charAt(0).toUpperCase() : '?'}
                  </ThemedText>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.cameraButton,
                  { backgroundColor: Colors[colorScheme].tint }
                ]}
                onPress={pickImage}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.profileNameText}>
              {name || 'Your Name'}
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            <ThemedText style={styles.inputLabel}>Name</ThemedText>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBackground,
                  borderColor: borderColor
                }
              ]}
            >
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Enter your name"
                placeholderTextColor={placeholderColor}
                value={name}
                onChangeText={setName}
              />
            </View>

            <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBackground,
                  borderColor: borderColor
                }
              ]}
            >
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Enter your email"
                placeholderTextColor={placeholderColor}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <ThemedText style={styles.inputLabel}>Birth Date</ThemedText>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
            >
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: inputBackground,
                    borderColor: borderColor
                  }
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={placeholderColor}
                  editable={false}
                  value={formatDate(birthDate)}
                />
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={placeholderColor}
                  style={styles.inputIcon}
                />
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <ThemedText style={styles.inputLabel}>Gender</ThemedText>
            <TouchableOpacity
              onPress={toggleGenderPicker}
            >
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: inputBackground,
                    borderColor: borderColor
                  }
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Select gender"
                  placeholderTextColor={placeholderColor}
                  editable={false}
                  value={gender}
                />
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={placeholderColor}
                  style={styles.inputIcon}
                />
              </View>
            </TouchableOpacity>

            {showGenderPicker && (
              <View
                style={[
                  styles.pickerContainer,
                  { backgroundColor: inputBackground }
                ]}
              >
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => selectGender('Male')}
                >
                  <ThemedText style={[
                    styles.pickerItemText,
                    gender === 'Male' && { color: Colors[colorScheme].tint, fontWeight: '600' }
                  ]}>
                    Male
                  </ThemedText>
                  {gender === 'Male' && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors[colorScheme].tint}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => selectGender('Female')}
                >
                  <ThemedText style={[
                    styles.pickerItemText,
                    gender === 'Female' && { color: Colors[colorScheme].tint, fontWeight: '600' }
                  ]}>
                    Female
                  </ThemedText>
                  {gender === 'Female' && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors[colorScheme].tint}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => selectGender('Other')}
                >
                  <ThemedText style={[
                    styles.pickerItemText,
                    gender === 'Other' && { color: Colors[colorScheme].tint, fontWeight: '600' }
                  ]}>
                    Other
                  </ThemedText>
                  {gender === 'Other' && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors[colorScheme].tint}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}

            <ThemedText style={styles.inputLabel}>Password</ThemedText>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBackground,
                  borderColor: borderColor
                }
              ]}
            >
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Enter new password"
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

            <ThemedText
              style={styles.passwordHelperText}
              lightColor={Colors.light.subtext}
              darkColor={Colors.dark.subtext}
            >
              Leave blank to keep current password
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[
              styles.updateButton,
              { backgroundColor: Colors[colorScheme].primaryButton },
              isLoading && styles.updateButtonDisabled
            ]}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <ThemedText style={styles.updateButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                Update
              </ThemedText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileNameText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  eyeIcon: {
    padding: 10,
    paddingHorizontal: 16,
  },
  pickerContainer: {
    borderRadius: 12,
    marginTop: -10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pickerItemText: {
    fontSize: 16,
  },
  passwordHelperText: {
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
  },
  updateButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});