import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ActionsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const latestRun = useQuery(api.runs.getLatest);
  const runId = (params.runId as any) || latestRun?._id;
  const run = useQuery(api.runs.get, runId ? { runId } : "skip" as any);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!runId || !run) {
    return (
      <ThemedView type="background" style={styles.centered}>
        <ActivityIndicator size="large" color={theme.backgroundSelected} />
        <ThemedText type="default" themeColor="textSecondary" style={{ marginTop: 12 }}>
          Loading recommendations...
        </ThemedText>
      </ThemedView>
    );
  }

  const recommendations = (run.recommendations as any[]) || [];

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#14B8A6';
      case 'medium': return '#F59E0B';
      case 'low': return '#94A3B8';
      default: return '#94A3B8';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return '#818CF8';
      case 'Marketing': return '#F472B6';
      case 'Retention': return '#34D399';
      case 'Finance': return '#FBBF24';
      case 'Conversion': return '#60A5FA';
      case 'Logistics': return '#FB923C';
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
              STRATEGY ENGINE — DECIDE
            </ThemedText>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              Recommended Actions
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Select actions to simulate execution. Ranked by projected impact score.
            </ThemedText>
          </View>

          {/* Recommendation Cards */}
          {recommendations.map((rec: any, idx: number) => {
            const isSelected = selectedIds.includes(rec.id);
            return (
              <Pressable
                key={rec.id}
                onPress={() => toggleSelection(rec.id)}
                style={({ pressed }) => [
                  styles.recCard,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: isSelected ? theme.backgroundSelected : 'transparent',
                    borderWidth: isSelected ? 2 : 2,
                    opacity: pressed ? 0.92 : 1,
                  }
                ]}
              >
                {/* Top Row: Rank + Category */}
                <View style={styles.recTopRow}>
                  <View style={styles.rankBadge}>
                    <ThemedText type="code" style={styles.rankText}>
                      #{idx + 1}
                    </ThemedText>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(rec.category) + '20' }]}>
                    <ThemedText type="code" style={[styles.categoryText, { color: getCategoryColor(rec.category) }]}>
                      {rec.category}
                    </ThemedText>
                  </View>
                  {/* Selection Indicator */}
                  <View style={{ flex: 1 }} />
                  <View style={[
                    styles.checkbox,
                    {
                      backgroundColor: isSelected ? theme.backgroundSelected : 'transparent',
                      borderColor: isSelected ? theme.backgroundSelected : theme.textSecondary + '60',
                    }
                  ]}>
                    {isSelected && (
                      <ThemedText type="code" style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '900' }}>
                        ✓
                      </ThemedText>
                    )}
                  </View>
                </View>

                {/* Title */}
                <ThemedText type="default" style={styles.recTitle}>
                  {rec.title}
                </ThemedText>

                {/* Description */}
                <ThemedText type="small" themeColor="textSecondary" style={styles.recDesc}>
                  {rec.desc}
                </ThemedText>

                {/* Impact / Effort / Cost Row */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricPill}>
                    <ThemedText type="code" style={{ color: '#94A3B8', fontSize: 10 }}>IMPACT</ThemedText>
                    <View style={styles.impactBarBg}>
                      <View style={[styles.impactBarFill, {
                        width: `${rec.impactScore}%`,
                        backgroundColor: getImpactColor(rec.impact)
                      }]} />
                    </View>
                    <ThemedText type="code" style={{ color: getImpactColor(rec.impact), fontSize: 11, fontWeight: '700' }}>
                      {rec.impactScore}
                    </ThemedText>
                  </View>

                  <View style={styles.tagRow}>
                    <View style={[styles.tag, { backgroundColor: '#070A13' }]}>
                      <ThemedText type="code" style={{ color: '#94A3B8', fontSize: 10 }}>
                        Effort: {rec.effort}
                      </ThemedText>
                    </View>
                    <View style={[styles.tag, { backgroundColor: '#070A13' }]}>
                      <ThemedText type="code" style={{ color: '#94A3B8', fontSize: 10 }}>
                        Cost: {rec.cost}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}

          {/* Bottom CTA */}
          <View style={styles.ctaContainer}>
            <Pressable
              onPress={() => router.push({ pathname: '/simulation', params: { runId } })}
              disabled={selectedIds.length === 0}
              style={({ pressed }) => [
                styles.ctaButton,
                {
                  backgroundColor: selectedIds.length > 0 ? theme.backgroundSelected : theme.backgroundElement,
                  opacity: pressed ? 0.9 : 1,
                }
              ]}
            >
              <ThemedText type="default" style={[
                styles.ctaText,
                { color: selectedIds.length > 0 ? '#FFFFFF' : theme.textSecondary }
              ]}>
                {selectedIds.length > 0
                  ? `Simulate ${selectedIds.length} Action${selectedIds.length > 1 ? 's' : ''} →`
                  : 'Select actions to simulate'}
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
  recCard: {
    borderRadius: 16,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  recTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#070A13',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  recDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
    gap: Spacing.three,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  impactBarBg: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#070A13',
    overflow: 'hidden',
  },
  impactBarFill: {
    height: 5,
    borderRadius: 3,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  ctaContainer: {
    marginTop: Spacing.three,
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
