import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL ?? "http://localhost:5173");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </ConvexProvider>
  );
}
