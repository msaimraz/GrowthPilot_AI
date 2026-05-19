import React from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function DashboardScreen() {
  const params = useLocalSearchParams();
  const theme = useTheme();
  const runId = params.runId as any;
  const run = useQuery(api.runs.get, runId ? { runId } : "skip" as any);

  if (!runId || !run) {
    return (
      <ThemedView type="background" style={styles.centered}>
        <ActivityIndicator size="large" color={theme.backgroundSelected} />
        <ThemedText type="default" themeColor="textSecondary" style={{ marginTop: 12 }}>
          Loading insights...
        </ThemedText>
      </ThemedView>
    );
  }

  const insights = run.insights as any;
  const rootCauses = run.rootCauses as any;
  const metrics = insights?.metrics || [];
  const anomalies = insights?.anomalies || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#14B8A6';
      case 'bad': return '#EF4444';
      case 'warn': return '#F59E0B';
      default: return '#94A3B8';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.safeArea}>

          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="smallBold" style={{ color: theme.backgroundSelected, letterSpacing: 1.5, fontSize: 11 }}>
              INSIGHT ENGINE — OBSERVE & REASON
            </ThemedText>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              Insights Dashboard
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {run.datasetName}
            </ThemedText>
          </View>

          {/* KPI Metrics Grid */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
              KEY METRICS
            </ThemedText>
          </View>
          <View style={styles.metricsGrid}>
            {metrics.map((metric: any, idx: number) => (
              <View key={idx} style={[styles.metricCard, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.metricName}>
                  {metric.name}
                </ThemedText>
                <ThemedText type="subtitle" style={styles.metricValue}>
                  {metric.value}
                </ThemedText>
                <View style={styles.changeRow}>
                  <View style={[styles.changeBadge, { backgroundColor: getStatusColor(metric.status) + '20' }]}>
                    <ThemedText type="code" style={[styles.changeText, { color: getStatusColor(metric.status) }]}>
                      {metric.change}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Anomalies Detected */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
              ANOMALIES DETECTED
            </ThemedText>
          </View>
          {anomalies.map((anomaly: any, idx: number) => (
            <View key={idx} style={[styles.anomalyCard, { backgroundColor: theme.backgroundElement }]}>
              <View style={styles.anomalyIconRow}>
                <View style={[styles.anomalyDot, { backgroundColor: '#EF4444' }]} />
                <ThemedText type="default" style={styles.anomalyTitle}>
                  {anomaly.title}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={styles.anomalyDesc}>
                {anomaly.desc}
              </ThemedText>
            </View>
          ))}

          {/* Root Cause Analysis */}
          {rootCauses && (
            <>
              <View style={styles.sectionHeader}>
                <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
                  ROOT CAUSE ANALYSIS
                </ThemedText>
              </View>
              <View style={[styles.rootCauseCard, { backgroundColor: theme.backgroundElement, borderLeftColor: '#F59E0B' }]}>
                <ThemedText type="smallBold" style={{ color: '#F59E0B', fontSize: 11, letterSpacing: 1 }}>
                  PRIMARY CAUSE
                </ThemedText>
                <ThemedText type="default" style={styles.rootCauseTitle}>
                  {rootCauses.primary}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.rootCauseDetail}>
                  {rootCauses.detailed}
                </ThemedText>

                {/* Metrics Effect */}
                {rootCauses.metricsEffect && (
                  <View style={styles.effectGrid}>
                    {rootCauses.metricsEffect.map((effect: any, idx: number) => (
                      <View key={idx} style={[styles.effectItem, { backgroundColor: '#0F172A' }]}>
                        <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 11 }}>
                          {effect.metric}
                        </ThemedText>
                        <ThemedText type="smallBold" style={{ color: '#EF4444', fontSize: 13 }}>
                          {effect.impact}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}

        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: Spacing.three,
    marginBottom: Spacing.four,
    gap: Spacing.one,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  changeRow: {
    flexDirection: 'row',
    marginTop: Spacing.one,
  },
  changeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  anomalyCard: {
    borderRadius: 14,
    padding: Spacing.four,
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  anomalyIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  anomalyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  anomalyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  anomalyDesc: {
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 18,
  },
  rootCauseCard: {
    borderRadius: 14,
    padding: Spacing.four,
    borderLeftWidth: 4,
    gap: Spacing.two,
  },
  rootCauseTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  rootCauseDetail: {
    fontSize: 14,
    lineHeight: 21,
  },
  effectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  effectItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 10,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
