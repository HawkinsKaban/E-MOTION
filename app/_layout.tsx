import { Stack } from 'expo-router';
import { useColorScheme } from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].background,
        },
        headerTintColor: Colors[colorScheme].text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
      <Stack.Screen name="record" options={{ title: 'Record Voice' }} />
      <Stack.Screen name="upload" options={{ title: 'Upload Voice' }} />
      <Stack.Screen name="analysis" options={{ title: 'Analyzing' }} />
      <Stack.Screen name="result" options={{ title: 'Emotion Analysis Result' }} />
      <Stack.Screen name="profile" options={{ title: 'User Profile' }} />
      <Stack.Screen name="not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}