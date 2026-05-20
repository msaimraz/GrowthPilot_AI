import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Pressable, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Fade-in animation hook
function useFadeIn(delay: number = 0) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(15)).current;
  useEffect(() => {
    const timer = setTimeout(() => {
      RNAnimated.parallel([
        RNAnimated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        RNAnimated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  return { opacity, transform: [{ translateY }] };
}

export default function TimelineScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const theme = useTheme();
  
  const latestRun = useQuery(api.runs.getLatest);
  const runId = (params.runId as any) || latestRun?._id;
  const run = useQuery(api.runs.get, runId ? { runId } : "skip" as any);
  const triggerSimulation = useAction(api.runs.simulateLoop);
  const createRun = useMutation(api.runs.create);

  const [simulating, setSimulating] = useState(false);
  const logEndRef = useRef<ScrollView>(null);

  // Auto-trigger simulation loop on load if it's the first log
  useEffect(() => {
    if (run && run.status === 'running' && run.logs.length === 1 && !simulating) {
      setSimulating(true);
      triggerSimulation({ runId, datasetName: run.datasetName })
        .catch((err) => console.error('Simulation execution failed:', err))
        .finally(() => setSimulating(false));
    }
  }, [run, runId]);

  // Autoscroll logs window to bottom
  useEffect(() => {
    if (logEndRef.current) {
      setTimeout(() => {
        logEndRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [run?.logs]);

  // Pulsing active agent ring animation
  const pulseAnim = useRef(new RNAnimated.Value(0.8)).current;
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Staggered screen item entries
  const headerAnim = useFadeIn(0);
  const timelineAnim = useFadeIn(150);
  const consoleAnim = useFadeIn(300);
  const controlsAnim = useFadeIn(400);

  const handleRestartSimulation = async () => {
    if (!run) return;
    setSimulating(true);
    try {
      const newRunId = await createRun({ datasetName: run.datasetName });
      router.setParams({ runId: newRunId });
      setSimulating(false);
    } catch (err) {
      console.error('Failed to restart simulation:', err);
      setSimulating(false);
    }
  };

  if (!runId || !run) {
    return (
      <ThemedView type="background" style={styles.centered}>
        <ActivityIndicator size="large" color={theme.backgroundSelected} />
        <ThemedText type="default" themeColor="textSecondary" style={{ marginTop: 12 }}>
          Loading active agent loop...
        </ThemedText>
      </ThemedView>
    );
  }

  const stepsList = [
    { key: 'Observe', label: 'Observe', agent: 'Insight Agent' },
    { key: 'Reason', label: 'Reason', agent: 'Root Cause Agent' },
    { key: 'Decide', label: 'Decide', agent: 'Strategy Agent' },
    { key: 'Act', label: 'Act', agent: 'Execution Agent' },
    { key: 'Evaluate', label: 'Evaluate', agent: 'Evaluation Agent' }
  ];

  const getStepStatus = (stepKey: string) => {
    const currentStepIndex = stepsList.findIndex(s => s.key === run.step);
    const targetStepIndex = stepsList.findIndex(s => s.key === stepKey);

    if (run.status === 'completed') return 'completed';
    if (currentStepIndex === targetStepIndex) return 'active';
    if (currentStepIndex > targetStepIndex) return 'completed';
    return 'pending';
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Run Metadata Header */}
        <RNAnimated.View style={[styles.header, headerAnim]}>
          <ThemedText type="smallBold" style={{ color: theme.backgroundSelected, letterSpacing: 1.5, fontSize: 11 }}>
            AUTONOMOUS OPERATOR LOOP
          </ThemedText>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            {run.datasetName}
          </ThemedText>
          <View style={styles.statusRow}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: run.status === 'completed' ? '#14B8A6' : '#0EA5E9' }
            ]} />
            <ThemedText type="small" themeColor="textSecondary">
              Status: {run.status.toUpperCase()} {run.status !== 'completed' && `— Active: ${run.activeAgent}`}
            </ThemedText>
          </View>
        </RNAnimated.View>

        {/* State Machine Steps Timeline */}
        <RNAnimated.View style={[styles.timelineCard, { backgroundColor: theme.backgroundElement }, timelineAnim]}>
          {stepsList.map((item, index) => {
            const status = getStepStatus(item.key);
            
            return (
              <View key={item.key} style={styles.timelineItem}>
                <View style={styles.indicatorContainer}>
                  {/* Outer circle */}
                  <View style={[
                    styles.circleOutline,
                    status === 'active' && { borderColor: theme.backgroundSelected },
                    status === 'completed' && { borderColor: '#14B8A6' },
                    status === 'pending' && { borderColor: theme.textSecondary + '40' }
                  ]}>
                    {/* Inner node */}
                    {status === 'active' ? (
                      <RNAnimated.View style={[
                        styles.circleInnerActive,
                        { backgroundColor: theme.backgroundSelected, transform: [{ scale: pulseAnim }] }
                      ]} />
                    ) : (
                      <View style={[
                        styles.circleInner,
                        status === 'completed' && { backgroundColor: '#14B8A6' },
                        status === 'pending' && { backgroundColor: 'transparent' }
                      ]} />
                    )}
                  </View>
                  {/* Connector Line */}
                  {index < stepsList.length - 1 && (
                    <View style={[
                      styles.connectorLine,
                      { backgroundColor: status === 'completed' ? '#14B8A6' : theme.textSecondary + '20' }
                    ]} />
                  )}
                </View>
                
                <View style={styles.stepTextContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <ThemedText 
                      type="smallBold" 
                      style={[
                        styles.stepLabel,
                        status === 'active' && { color: theme.backgroundSelected },
                        status === 'completed' && { color: '#14B8A6' }
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                    {status === 'active' && (
                      <View style={[styles.activeTag, { backgroundColor: theme.backgroundSelected + '20' }]}>
                        <ThemedText type="code" style={{ color: theme.backgroundSelected, fontSize: 8, fontWeight: '700' }}>
                          THINKING...
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.agent}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </RNAnimated.View>

        {/* Rolling Logs Console */}
        <RNAnimated.View style={[{ flex: 1 }, consoleAnim]}>
          <View style={styles.consoleHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={{ fontSize: 11, letterSpacing: 1 }}>
              REALTIME WORKLOGS
            </ThemedText>
          </View>
          
          <View style={[styles.consoleContainer, { backgroundColor: '#020617', borderColor: theme.backgroundElement }]}>
            <View style={styles.consoleBar}>
              <View style={styles.winDotContainer}>
                <View style={[styles.winDot, { backgroundColor: '#EF4444' }]} />
                <View style={[styles.winDot, { backgroundColor: '#F59E0B' }]} />
                <View style={[styles.winDot, { backgroundColor: '#10B981' }]} />
              </View>
              <ThemedText type="code" style={styles.consoleTitle}>operator_agent@growthpilot:~</ThemedText>
            </View>
            
            <ScrollView 
              ref={logEndRef}
              contentContainerStyle={styles.consoleScroll}
              showsVerticalScrollIndicator={true}
            >
              {run.logs.map((log, idx) => {
                let logColor = '#F8FAFC';
                if (log.type === 'success') logColor = '#14B8A6';
                if (log.type === 'warn') logColor = '#F59E0B';
                if (log.type === 'error') logColor = '#EF4444';
                
                const timeString = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                return (
                  <View key={idx} style={styles.logRow}>
                    <ThemedText type="code" style={styles.logTime}>
                      [{timeString}]
                    </ThemedText>
                    <ThemedText type="code" style={[styles.logAgent, { color: theme.backgroundSelected }]}>
                      [{log.agent}]
                    </ThemedText>
                    <ThemedText type="code" style={[styles.logMsg, { color: logColor }]}>
                      {log.message}
                    </ThemedText>
                  </View>
                );
              })}
              
              {run.status !== 'completed' && (
                <View style={styles.thinkingLogContainer}>
                  <ActivityIndicator size="small" color={theme.backgroundSelected} style={{ marginRight: 6 }} />
                  <ThemedText type="code" style={{ color: theme.backgroundSelected }}>
                    Agent is processing next insight stream...
                  </ThemedText>
                </View>
              )}
            </ScrollView>
          </View>
        </RNAnimated.View>

        {/* Action Controls */}
        <RNAnimated.View style={[styles.controlsRow, controlsAnim]}>
          {run.status === 'completed' ? (
            <Pressable
              onPress={() => router.push({ pathname: '/dashboard', params: { runId } })}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.backgroundSelected, opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <ThemedText type="default" style={styles.buttonText}>
                Proceed to Dashboard →
              </ThemedText>
            </Pressable>
          ) : (
            <View style={styles.runningContainer}>
              <ActivityIndicator size="small" color={theme.backgroundSelected} />
              <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: 8, fontWeight: '600' }}>
                Orchestrating agent loop...
              </ThemedText>
            </View>
          )}

          <Pressable
            onPress={handleRestartSimulation}
            disabled={simulating}
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: theme.backgroundSelected, opacity: pressed || simulating ? 0.7 : 1 }
            ]}
          >
            <ThemedText type="smallBold" style={{ color: theme.backgroundSelected }}>
              Restart Loop
            </ThemedText>
          </Pressable>
        </RNAnimated.View>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    paddingBottom: BottomTabInset + Spacing.three,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: Spacing.three,
    marginBottom: Spacing.three,
    gap: Spacing.one,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineCard: {
    borderRadius: 20,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.four,
    height: 60,
  },
  indicatorContainer: {
    alignItems: 'center',
    width: 24,
  },
  circleOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  circleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  circleInnerActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  connectorLine: {
    width: 2,
    height: 38,
    marginTop: 2,
  },
  stepTextContainer: {
    justifyContent: 'center',
    paddingTop: 1,
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  activeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  consoleHeader: {
    marginBottom: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  consoleContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Spacing.four,
  },
  consoleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    position: 'relative',
  },
  winDotContainer: {
    flexDirection: 'row',
    gap: 6,
    position: 'absolute',
    left: 12,
  },
  winDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  consoleTitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  consoleScroll: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  logRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.half,
  },
  logTime: {
    fontSize: 12,
    color: '#64748B',
  },
  logAgent: {
    fontSize: 12,
    fontWeight: '700',
  },
  logMsg: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  thinkingLogContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  runningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    height: 48,
    paddingHorizontal: Spacing.four,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
});
