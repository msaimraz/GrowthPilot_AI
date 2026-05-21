import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.backgroundSelected,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Intake',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cloud-upload' : 'cloud-upload-outline'} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Operator',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'eye' : 'eye-outline'} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="actions"
        options={{
          title: 'Decide',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'git-branch' : 'git-branch-outline'} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="simulation"
        options={{
          title: 'Act',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'terminal' : 'terminal-outline'} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="results"
        options={{
          title: 'Evaluate',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'award' : 'award-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
