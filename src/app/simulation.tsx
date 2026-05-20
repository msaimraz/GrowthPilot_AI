import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SimulationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
  const runId = params.runId as any;
  const run = useQuery(api.runs.get, runId ? { runId } : "skip" as any);

  const [simulating, setSimulating] = useState(true);
  const logEndRef = useRef<ScrollView>(null);

  // Auto-scroll logic for the terminal
  useEffect(() => {
    if (logEndRef.current) {
      setTimeout(() => {
        logEndRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [run?.simulationLogs]);

  // Simulate an ongoing execution process if logs are loaded
  useEffect(() => {
    if (run?.simulationLogs && run.simulationLogs.length > 0) {
      // If we have logs, consider the "simulation" complete after a short delay for effect
      const timer = setTimeout(() => {
        setSimulating(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [run?.simulationLogs]);

  if (!runId || !run) {
    return (
      <ThemedView type="background" style={styles.centered}>
        <ActivityIndicator size="large" color={theme.backgroundSelected} />
        <ThemedText type="default" themeColor="textSecondary" style={{ marginTop: 12 }}>
          Initializing execution environment...
        </ThemedText>
      </ThemedView>
    );
  }

  const logs = run.simulationLogs || [];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="smallBold" style={{ color: '#F59E0B', letterSpacing: 1.5, fontSize: 11 }}>
            EXECUTION ENGINE — ACT
          </ThemedText>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Action Simulation Console
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Live execution trace for selected recommendations.
          </ThemedText>
        </View>

        {/* Status indicator row */}
        <View style={styles.statusRow}>
           {simulating ? (
             <>
               <ActivityIndicator size="small" color="#F59E0B" />
               <ThemedText type="smallBold" style={{ color: '#F59E0B', marginLeft: 8 }}>
                 EXECUTING ACTIONS...
               </ThemedText>
             </>
           ) : (
             <>
               <View style={[styles.statusDot, { backgroundColor: '#14B8A6' }]} />
               <ThemedText type="smallBold" style={{ color: '#14B8A6', marginLeft: 8 }}>
                 EXECUTION COMPLETE
               </ThemedText>
             </>
           )}
        </View>

        {/* Terminal Container */}
        <View style={[styles.terminalContainer, { backgroundColor: '#020617', borderColor: theme.backgroundElement }]}>
          <View style={styles.terminalHeader}>
             <View style={styles.windowControls}>
                <View style={[styles.windowDot, { backgroundColor: '#EF4444' }]} />
                <View style={[styles.windowDot, { backgroundColor: '#F59E0B' }]} />
                <View style={[styles.windowDot, { backgroundColor: '#10B981' }]} />
             </View>
             <ThemedText type="code" style={styles.terminalTitle}>bash — root@growthpilot-ai:~</ThemedText>
          </View>
          
          <ScrollView 
            ref={logEndRef}
            contentContainerStyle={styles.consoleScroll}
            showsVerticalScrollIndicator={true}
          >
            {logs.length === 0 && simulating ? (
               <ThemedText type="code" style={{ color: '#94A3B8' }}>
                 Waiting for simulation logs...
               </ThemedText>
            ) : (
               logs.map((log: any, idx: number) => {
                 let logColor = '#F8FAFC'; // info
                 let prefix = '[INFO]';
                 if (log.type === 'success') { logColor = '#14B8A6'; prefix = '[SUCCESS]'; }
                 if (log.type === 'warn') { logColor = '#F59E0B'; prefix = '[WARN]'; }
                 if (log.type === 'error') { logColor = '#EF4444'; prefix = '[ERROR]'; }
                 if (log.type === 'action') { logColor = '#0EA5E9'; prefix = '[ACTION]'; }

                 return (
                   <View key={idx} style={styles.logRow}>
                     <ThemedText type="code" style={[styles.logPrefix, { color: logColor }]}>
                       {prefix}
                     </ThemedText>
                     <ThemedText type="code" style={[styles.logMsg, { color: logColor }]}>
                       {log.message}
                     </ThemedText>
                   </View>
                 );
               })
            )}
            
            {/* Blinking cursor effect at the end when executing */}
            {simulating && (
               <View style={styles.cursorRow}>
                  <ThemedText type="code" style={{ color: '#F8FAFC' }}>$</ThemedText>
                  <View style={styles.cursorBlock} />
               </View>
            )}
          </ScrollView>
        </View>

        {/* Proceed CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            onPress={() => router.push({ pathname: '/results', params: { runId } })}
            disabled={simulating}
            style={({ pressed }) => [
              styles.ctaButton,
              {
                backgroundColor: simulating ? theme.backgroundElement : theme.backgroundSelected,
                opacity: pressed ? 0.9 : 1,
              }
            ]}
          >
            <ThemedText type="default" style={[
              styles.ctaText,
              { color: simulating ? theme.textSecondary : '#0F172A' }
            ]}>
              {simulating ? 'Awaiting Completion...' : 'View Evaluation Results →'}
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
    fontSize: 26,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  terminalContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.four,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  windowControls: {
    position: 'absolute',
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  windowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  terminalTitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  consoleScroll: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    marginBottom: Spacing.half,
  },
  logPrefix: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 70,
  },
  logMsg: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  cursorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.one,
  },
  cursorBlock: {
    width: 8,
    height: 16,
    backgroundColor: '#F8FAFC',
    opacity: 0.8,
  },
  ctaContainer: {
    marginTop: 'auto',
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
