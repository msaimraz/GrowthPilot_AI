import React, { useState } from 'react';
import { Platform, StyleSheet, View, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const createRun = useMutation(api.runs.create);
  
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleSelectDataset = async (name: string) => {
    setLoading(true);
    setUploadStatus('Reading raw business report...');
    
    // Simulate premium ingest experience
    setTimeout(() => {
      setUploadStatus('Parsing layout and mapping schema...');
    }, 1000);
    
    setTimeout(async () => {
      setUploadStatus('Syncing to realtime Convex database...');
      try {
        const runId = await createRun({ datasetName: name });
        router.push({
          pathname: '/timeline',
          params: { runId }
        });
      } catch (err) {
        console.error('Failed to create run:', err);
        // Fallback for demo if backend isn't running or configured yet
        router.push('/timeline');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleSimulatedFileUpload = () => {
    handleSelectDataset('Uploaded_Report_Q2.csv');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header Section */}
          <View style={styles.header}>
            <AnimatedIcon />
            <ThemedText type="title" style={styles.title}>
              GrowthPilot AI
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
              Your autonomous AI Growth Operator. Ingest data, simulate actions, evaluate outcomes.
            </ThemedText>
          </View>

          {/* Upload Drop Zone Card */}
          <Pressable 
            onPress={handleSimulatedFileUpload} 
            disabled={loading}
            style={({ pressed }) => [
              styles.dropZone, 
              { borderColor: theme.backgroundSelected, opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <View style={[styles.iconPlaceholder, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="subtitle" style={{ color: theme.backgroundSelected }}>↑</ThemedText>
            </View>
            <ThemedText type="default" style={styles.dropZoneTitle}>
              Upload business reports
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.dropZoneSub}>
              Supports PDF, CSV or Excel files. Click to browse.
            </ThemedText>
          </Pressable>

          {/* Or Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.backgroundElement }]} />
            <ThemedText type="small" themeColor="textSecondary" style={styles.dividerText}>
              OR SELECT DEMO DATASET
            </ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.backgroundElement }]} />
          </View>

          {/* Demo Cards List */}
          <View style={styles.demoContainer}>
            {/* Card 1 */}
            <Pressable
              onPress={() => handleSelectDataset('D2C Shopify Performance Check')}
              disabled={loading}
              style={({ pressed }) => [
                styles.demoCard,
                { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <View style={styles.cardHeader}>
                <ThemedText type="smallBold" style={[styles.cardBadge, { color: theme.backgroundSelected }]}>
                  SHOPIFY + META ADS
                </ThemedText>
              </View>
              <ThemedText type="default" style={styles.cardTitle}>
                D2C Shopify Performance Check
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardDesc}>
                Detects high CAC, product checkout dropoffs, and optimizes ad budget allocations.
              </ThemedText>
            </Pressable>

            {/* Card 2 */}
            <Pressable
              onPress={() => handleSelectDataset('B2B SaaS Lead Funnel Diagnostics')}
              disabled={loading}
              style={({ pressed }) => [
                styles.demoCard,
                { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <View style={styles.cardHeader}>
                <ThemedText type="smallBold" style={[styles.cardBadge, { color: theme.backgroundSelected }]}>
                  SALESFORCE + ADWORDS
                </ThemedText>
              </View>
              <ThemedText type="default" style={styles.cardTitle}>
                B2B SaaS Lead Funnel Diagnostics
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardDesc}>
                Diagnoses sudden traffic spikes coupled with lower lead-to-opportunity conversion.
              </ThemedText>
            </Pressable>

            {/* Card 3 */}
            <Pressable
              onPress={() => handleSelectDataset('E-commerce Logistics & Retention Analyser')}
              disabled={loading}
              style={({ pressed }) => [
                styles.demoCard,
                { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <View style={styles.cardHeader}>
                <ThemedText type="smallBold" style={[styles.cardBadge, { color: theme.backgroundSelected }]}>
                  STRIPE + AMAZON FBA
                </ThemedText>
              </View>
              <ThemedText type="default" style={styles.cardTitle}>
                Logistics & Retention Analyser
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cardDesc}>
                Flags shipping delay anomalies causing refund spikes and customer churn.
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={[styles.overlay, { backgroundColor: 'rgba(15, 23, 42, 0.85)' }]}>
          <ActivityIndicator size="large" color={theme.backgroundSelected} />
          <ThemedText type="default" style={styles.overlayText}>
            {uploadStatus}
          </ThemedText>
        </View>
      )}
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
    alignItems: 'center',
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 500,
    fontSize: 15,
    lineHeight: 22,
  },
  dropZone: {
    width: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.two,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  dropZoneTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  dropZoneSub: {
    fontSize: 13,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.two,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.three,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  demoContainer: {
    width: '100%',
    gap: Spacing.three,
  },
  demoCard: {
    width: '100%',
    borderRadius: 12,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.one,
  },
  cardBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: Spacing.one,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    gap: Spacing.three,
  },
  overlayText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
