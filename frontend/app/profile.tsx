import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Switch,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import Colors from '../constants/Colors';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { ThemeSystemToggle } from '../components/ThemeSystemToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageHeader } from '../components/PageHeader';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background });
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text });
  const cardColor = useThemeColor({ light: Colors.light.card, dark: Colors.dark.card });
  const borderColor = useThemeColor({ light: Colors.light.border, dark: Colors.dark.border });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    checkLoginStatus();
    loadSettings();
    countAnalyses();
    loadProfileImage();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const storedUsername = await AsyncStorage.getItem('username');
      const userEmail = await AsyncStorage.getItem('userEmail');

      if (userToken) {
        setIsLoggedIn(true);
        setUsername(storedUsername || 'User');
        setEmail(userEmail || (storedUsername ? `${storedUsername.toLowerCase().replace(/\s+/g, '.')}@example.com` : 'user@example.com'));
      } else {
        setIsLoggedIn(false);
        setUsername('');
        setEmail('');
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('userSettings');

      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotificationsEnabled(parsedSettings.notifications ?? true);
        setDataSharing(parsedSettings.dataSharing ?? false);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const loadProfileImage = async () => {
    try {
      const image = await AsyncStorage.getItem('userProfileImage');
      if (image) {
        setProfileImage(image);
      }
    } catch (error) {
      console.log('Error loading profile image:', error);
    }
  };

  const countAnalyses = async () => {
    try {
      const historyString = await AsyncStorage.getItem('analysisHistory');

      if (historyString) {
        const history = JSON.parse(historyString);
        setTotalAnalyses(history.length);
      }
    } catch (error) {
      console.log('Error counting analyses:', error);
    }
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    saveSettings({ notifications: value, dataSharing });
  };

  const toggleDataSharing = async (value) => {
    setDataSharing(value);
    saveSettings({ notifications: notificationsEnabled, dataSharing: value });
  };

  const saveSettings = async (settings) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  // Function to delete all data
  const hardReset = async () => {
    try {
      // Clear all AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (e) {
      console.error("Error during hard reset:", e);
      return false;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Activate loading indicator
            setIsLogoutLoading(true);

            try {
              // Reset UI first
              setIsLoggedIn(false);
              setUsername('');
              setEmail('');
              setTotalAnalyses(0);

              // Perform hard reset - delete ALL data from AsyncStorage
              await hardReset();

              setTimeout(() => {
                // Turn off loading indicator
                setIsLogoutLoading(false);

                // Navigate to login page with force
                router.push({
                  pathname: '/login',
                  // Force reload parameter
                  params: {
                    reset: Date.now() // Random parameter to force refresh
                  }
                });
              }, 300);
            } catch (error) {
              console.error('Error during logout:', error);
              setIsLogoutLoading(false);
              Alert.alert('Error', 'Failed to log out. Please restart the app.');
            }
          }
        }
      ]
    );
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleAbout = () => {
    Alert.alert(
      'About E-MOTION',
      'E-MOTION is a voice emotion detection application specifically developed for the Indonesian population. Version 1.0.0',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'For assistance, please contact us at support@e-motion.id or visit our website.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to us. We collect and process voice data solely for emotion analysis purposes. All data is encrypted and stored securely.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={{ paddingTop: insets.top, backgroundColor: backgroundColor }}>
        <PageHeader title="Profile" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={styles.profileCard}
          lightColor={Colors.light.card}
          darkColor={Colors.dark.card}
        >
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <View
                style={[
                  styles.avatar,
                  { overflow: 'hidden' }
                ]}
              >
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: Colors[colorScheme].tint + '40' }
                ]}
              >
                <ThemedText style={styles.avatarText}>
                  {isLoggedIn ? username.charAt(0).toUpperCase() : '?'}
                </ThemedText>
              </View>
            )}
          </View>

          {isLoggedIn ? (
            <View style={styles.userInfoContainer}>
              <ThemedText style={styles.username}>
                {username}
              </ThemedText>

              <ThemedText
                style={styles.email}
                lightColor={Colors.light.subtext}
                darkColor={Colors.dark.subtext}
              >
                {email}
              </ThemedText>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statValue}>
                    {totalAnalyses}
                  </ThemedText>
                  <ThemedText
                    style={styles.statLabel}
                    lightColor={Colors.light.subtext}
                    darkColor={Colors.dark.subtext}
                  >
                    Analyses
                  </ThemedText>
                </View>
              </View>

              {/* Edit Profile Button */}
              <TouchableOpacity
                style={[
                  styles.editProfileButton,
                  {
                    backgroundColor: Colors[colorScheme].tint + '20',
                    borderColor: Colors[colorScheme].tint + '40',
                  }
                ]}
                onPress={() => router.push('/editProfile')}
              >
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color={Colors[colorScheme].tint}
                />
                <ThemedText
                  style={styles.editProfileButtonText}
                  lightColor={Colors[colorScheme].tint}
                  darkColor={Colors[colorScheme].tint}
                >
                  Edit Profile
                </ThemedText>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  {
                    backgroundColor: Colors[colorScheme].error + '20',
                    borderColor: Colors[colorScheme].error + '40',
                  }
                ]}
                onPress={handleLogout}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? (
                  <ActivityIndicator size="small" color={Colors[colorScheme].error} />
                ) : (
                  <>
                    <Ionicons
                      name="log-out-outline"
                      size={20}
                      color={Colors[colorScheme].error}
                    />
                    <ThemedText
                      style={styles.logoutButtonText}
                      lightColor={Colors[colorScheme].error}
                      darkColor={Colors[colorScheme].error}
                    >
                      Logout
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.userInfoContainer}>
              <ThemedText style={styles.notLoggedInTitle}>
                Not Logged In
              </ThemedText>

              <ThemedText
                style={styles.notLoggedInText}
                lightColor={Colors.light.subtext}
                darkColor={Colors.dark.subtext}
              >
                Login to save your analysis history and access all features.
              </ThemedText>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: Colors[colorScheme].primaryButton }
                ]}
                onPress={handleLogin}
              >
                <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                <ThemedText style={styles.loginButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Login
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>

        <ThemedView
          style={styles.sectionCard}
          lightColor={Colors.light.card}
          darkColor={Colors.dark.card}
        >
          <ThemedText style={styles.sectionTitle}>
            Settings
          </ThemedText>

          {/* Theme System Toggle - New improved toggle with system option */}
          <ThemeSystemToggle />

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors[colorScheme].tint}
                style={styles.settingIcon}
              />
              <ThemedText style={styles.settingLabel}>
                Notifications
              </ThemedText>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{
                false: '#767577',
                true: Colors[colorScheme].tint + '70'
              }}
              thumbColor={notificationsEnabled ? Colors[colorScheme].tint : '#f4f3f4'}
            />
          </View>

          <View
            style={[
              styles.settingItem,
              { borderBottomWidth: 0 }
            ]}
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="share-social-outline"
                size={22}
                color={Colors[colorScheme].tint}
                style={styles.settingIcon}
              />
              <ThemedText style={styles.settingLabel}>
                Anonymous Data Sharing
              </ThemedText>
            </View>

            <Switch
              value={dataSharing}
              onValueChange={toggleDataSharing}
              trackColor={{
                false: '#767577',
                true: Colors[colorScheme].tint + '70'
              }}
              thumbColor={dataSharing ? Colors[colorScheme].tint : '#f4f3f4'}
            />
          </View>
        </ThemedView>

        <ThemedView
          style={styles.sectionCard}
          lightColor={Colors.light.card}
          darkColor={Colors.dark.card}
        >
          <ThemedText style={styles.sectionTitle}>
            Information
          </ThemedText>

          {/* FAQ Menu Item */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/faq')}
          >
            <View style={styles.menuLabelContainer}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={Colors[colorScheme].tint}
                style={styles.menuIcon}
              />
              <ThemedText style={styles.menuLabel}>
                FAQ
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors[colorScheme].subtext}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleAbout}
          >
            <View style={styles.menuLabelContainer}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={Colors[colorScheme].tint}
                style={styles.menuIcon}
              />
              <ThemedText style={styles.menuLabel}>
                About E-MOTION
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors[colorScheme].subtext}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHelp}
          >
            <View style={styles.menuLabelContainer}>
              <Ionicons
                name="help-buoy-outline"
                size={22}
                color={Colors[colorScheme].tint}
                style={styles.menuIcon}
              />
              <ThemedText style={styles.menuLabel}>
                Help & Support
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors[colorScheme].subtext}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              { borderBottomWidth: 0 }
            ]}
            onPress={handlePrivacyPolicy}
          >
            <View style={styles.menuLabelContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={Colors[colorScheme].tint}
                style={styles.menuIcon}
              />
              <ThemedText style={styles.menuLabel}>
                Privacy Policy
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors[colorScheme].subtext}
            />
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
      
      {/* Add safe area padding to the bottom if needed */}
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  notLoggedInTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notLoggedInText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
  },
});