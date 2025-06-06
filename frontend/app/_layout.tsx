// app/_layout.tsx
import { Stack } from 'expo-router';
import { useColorScheme } from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
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
          // Hide all headers by default
          headerShown: false
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            unmountOnBlur: true
          }} 
        />
        
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="record" options={{ headerShown: false }} />
        <Stack.Screen name="upload" options={{ headerShown: false }} />
        <Stack.Screen name="analysis" options={{ headerShown: false }} />
        <Stack.Screen name="emotionAnimation" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="editProfile" options={{ headerShown: false }} />
        <Stack.Screen name="faq" options={{ headerShown: false }} />

        <Stack.Screen name="+not-found" options={{ headerShown: true, title: 'Oops!' }} />
      </Stack>
    </SafeAreaProvider>
  );
}