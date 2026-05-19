import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DashboardScreen() {
  return (
    <ThemedView type="background" style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Insights Dashboard</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
        Business anomalies, metrics, and KPI graphs
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary">
        (Phase 3: Insight Engine & Dashboards)
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
