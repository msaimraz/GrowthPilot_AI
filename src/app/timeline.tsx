import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TimelineScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const theme = useTheme();
  
  const runId = params.runId as any;
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
      }, 100);
    }
  }, [run?.logs]);

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
        <View style={styles.header}>
          <ThemedText type="smallBold" style={{ color: theme.backgroundSelected, letterSpacing: 1.5 }}>
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
              Status: {run.status.toUpperCase()} (Agent: {run.activeAgent})
            </ThemedText>
          </View>
        </View>

        {/* State Machine Steps Timeline */}
        <View style={[styles.timelineCard, { backgroundColor: theme.backgroundElement }]}>
          {stepsList.map((item, index) => {
            const status = getStepStatus(item.key);
            
            return (
              <View key={item.key} style={styles.timelineItem}>
                <View style={styles.indicatorContainer}>
                  {/* Outer circle */}
                  <View style={[
                    styles.circleOutline,
                    status === 'active' && { borderColor: theme.backgroundSelected, shadowColor: theme.backgroundSelected, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 },
                    status === 'completed' && { borderColor: '#14B8A6' },
                    status === 'pending' && { borderColor: theme.textSecondary + '40' }
                  ]}>
                    {/* Inner node */}
                    <View style={[
                      styles.circleInner,
                      status === 'active' && { backgroundColor: theme.backgroundSelected },
                      status === 'completed' && { backgroundColor: '#14B8A6' },
                      status === 'pending' && { backgroundColor: 'transparent' }
                    ]} />
                  </View>
                  {/* Connector Line */}
                  {index < stepsList.length - 1 && (
                    <View style={[
                      styles.connectorLine,
                      { backgroundColor: status === 'completed' ? '#14B8A6' : theme.textSecondary + '30' }
                    ]} />
                  )}
                </View>
                
                <View style={styles.stepTextContainer}>
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
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.agent}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>

        {/* Rolling Logs Console */}
        <View style={styles.consoleHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            AGENT WORKLOGS
          </ThemedText>
        </View>
        
        <View style={[styles.consoleContainer, { backgroundColor: '#020617', borderColor: theme.backgroundElement }]}>
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
          </ScrollView>
        </View>

        {/* Action Controls */}
        <View style={styles.controlsRow}>
          {run.status === 'completed' ? (
            <Pressable
              onPress={() => router.push({ pathname: '/dashboard', params: { runId } })}
              style={[styles.primaryButton, { backgroundColor: theme.backgroundSelected }]}
            >
              <ThemedText type="default" style={styles.buttonText}>
                Proceed to Dashboard →
              </ThemedText>
            </Pressable>
          ) : (
            <View style={styles.runningContainer}>
              <ActivityIndicator size="small" color={theme.backgroundSelected} />
              <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: 8 }}>
                AI Pilot operating growth simulation...
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
        </View>

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
    borderRadius: 16,
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
  consoleHeader: {
    marginBottom: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  consoleContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.four,
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
