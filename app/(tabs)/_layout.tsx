import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';
import { TabBarBackground } from '../../components/ui/TabBarBackground';
import { HapticTab } from '../../components/HapticTab';
import { LogoutButton } from '../../components/LogoutButton'; // Tambahkan import ini

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => <TabBarBackground />,
        headerShown: true, // Ubah menjadi true untuk menampilkan header
        headerRight: () => (
          <LogoutButton 
            style={{ 
              paddingVertical: 6, 
              paddingHorizontal: 12, 
              marginRight: 10,
              borderWidth: 0,
              backgroundColor: 'transparent' 
            }} 
            textStyle={{ fontSize: 14 }}
            showText={false}
            iconSize={24}
          />
        )
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Tabs>
  );
}