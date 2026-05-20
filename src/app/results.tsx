import React from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
  const latestRun = useQuery(api.runs.getLatest);
  const runId = (params.runId as any) || latestRun?._id;
  const run = useQuery(api.runs.get, runId ? { runId } : "skip" as any);

  if (!runId || !run) {
    return (
      <ThemedView type="background" style={styles.centered}>
        <ActivityIndicator size="large" color={theme.backgroundSelected} />
        <ThemedText type="default" themeColor="textSecondary" style={{ marginTop: 12 }}>
          Loading evaluation results...
        </ThemedText>
      </ThemedView>
    );
  }

  const evaluation = run.evaluationResult as any;
  const metrics = evaluation?.metrics || [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.safeArea}>

          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="smallBold" style={{ color: '#10B981', letterSpacing: 1.5, fontSize: 11 }}>
              EVALUATION ENGINE — OUTCOME
            </ThemedText>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              Projected Impact
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Estimated business outcomes post-execution.
            </ThemedText>
          </View>

          {/* Conclusion Card */}
          {evaluation && (
             <View style={[styles.conclusionCard, { backgroundColor: theme.backgroundElement }]}>
               <View style={styles.iconRow}>
                 <View style={styles.badgeContainer}>
                    <ThemedText type="code" style={styles.badgeText}>SUCCESS</ThemedText>
                 </View>
                 <ThemedText type="default" style={styles.conclusionTitle}>
                   {evaluation.conclusion}
                 </ThemedText>
               </View>
             </View>
          )}

          {/* Metrics Comparison */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
              BEFORE VS AFTER
            </ThemedText>
          </View>

          <View style={styles.metricsContainer}>
            {metrics.map((metric: any, idx: number) => {
              // Determine if the change is positive or negative for coloring
              // Simple heuristic: if change string contains "-" or "Decrease", it's bad, unless it's CPA/Churn where decrease is good. 
              // We'll rely on a basic color mapping for the demo.
              let changeColor = '#10B981'; // Default green
              if (metric.change.includes('-') && !metric.metric.includes('CPA') && !metric.metric.includes('Churn') && !metric.metric.includes('Disputes')) {
                 changeColor = '#EF4444'; // Red for negative revenue/conversion
              }
              if (metric.change.includes('-') && (metric.metric.includes('CPA') || metric.metric.includes('Disputes'))) {
                 changeColor = '#10B981'; // Green for lowering costs/disputes
              }

              return (
                <View key={idx} style={[styles.metricCard, { backgroundColor: theme.backgroundElement }]}>
                   <ThemedText type="default" style={styles.metricName}>{metric.metric}</ThemedText>
                   
                   <View style={styles.comparisonRow}>
                      <View style={styles.valueBox}>
                        <ThemedText type="small" themeColor="textSecondary">Before</ThemedText>
                        <ThemedText type="subtitle" style={styles.valueText}>{metric.before}</ThemedText>
                      </View>
                      
                      <View style={styles.arrowBox}>
                         <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>→</ThemedText>
                      </View>

                      <View style={styles.valueBox}>
                        <ThemedText type="small" themeColor="textSecondary">Projected</ThemedText>
                        <ThemedText type="subtitle" style={[styles.valueText, { color: changeColor }]}>{metric.after}</ThemedText>
                      </View>
                   </View>

                   <View style={[styles.deltaRow, { backgroundColor: '#0F172A' }]}>
                      <ThemedText type="smallBold" style={{ color: changeColor, fontSize: 12 }}>
                         {metric.change}
                      </ThemedText>
                   </View>
                </View>
              );
            })}
          </View>

          {/* Action CTA */}
          <View style={styles.ctaContainer}>
            <Pressable
              onPress={() => router.push('/')}
              style={({ pressed }) => [
                styles.ctaButton,
                {
                  backgroundColor: theme.backgroundSelected,
                  opacity: pressed ? 0.9 : 1,
                }
              ]}
            >
              <ThemedText type="default" style={[styles.ctaText, { color: '#0F172A' }]}>
                Start New Analysis
              </ThemedText>
            </Pressable>
          </View>

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
  conclusionCard: {
    borderRadius: 16,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  iconRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  badgeContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  conclusionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: Spacing.two,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  metricsContainer: {
    gap: Spacing.three,
  },
  metricCard: {
    borderRadius: 14,
    padding: Spacing.four,
  },
  metricName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.three,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  valueBox: {
    flex: 1,
    gap: 4,
  },
  arrowBox: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 24,
    fontWeight: '700',
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  ctaContainer: {
    marginTop: Spacing.five,
    marginBottom: Spacing.four,
  },
  ctaButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
