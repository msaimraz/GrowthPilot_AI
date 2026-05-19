import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ActionsScreen() {
  return (
    <ThemedView type="background" style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Strategy Actions</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
        Ranked growth recommendations and action plans
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary">
        (Phase 4: Strategy & Execution Simulation UI)
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
