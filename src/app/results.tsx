import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ResultsScreen() {
  return (
    <ThemedView type="background" style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Results & Evaluation</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
        Before vs After simulation projections and metrics comparison
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary">
        (Phase 5: Evaluation & Outcome Charts UI)
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
