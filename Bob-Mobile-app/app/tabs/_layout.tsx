import { Tabs, View } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function TabLayout() {
const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
      	tabBarStyle: { position: 'absolute', bottom:0, height:60 },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,

      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="updatetab"
        options={{
          title: 'Update',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
