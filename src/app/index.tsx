import React, { useState, useRef, useEffect } from 'react';
import { Platform, StyleSheet, View, Pressable, ActivityIndicator, ScrollView, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import * as DocumentPicker from 'expo-document-picker';

import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, BrandColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Fade-in animation hook
function useFadeIn(delay: number = 0) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(18)).current;
  useEffect(() => {
    const timer = setTimeout(() => {
      RNAnimated.parallel([
        RNAnimated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        RNAnimated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  return { opacity, transform: [{ translateY }] };
}

const INGEST_STEPS = [
  'Scanning document structure...',
  'Extracting tabular data & KPIs...',
  'Mapping schema to growth model...',
  'Connecting to Convex realtime engine...',
  'Initializing multi-agent pipeline...',
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const createRun = useMutation(api.runs.create);
  
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [statusStep, setStatusStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Animated pulse for the upload icon
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Staggered fade-in animations
  const headerAnim = useFadeIn(0);
  const dropZoneAnim = useFadeIn(150);
  const dividerAnim = useFadeIn(300);
  const card1Anim = useFadeIn(400);
  const card2Anim = useFadeIn(500);
  const card3Anim = useFadeIn(600);

  // Overlay progress animation
  const progressWidth = useRef(new RNAnimated.Value(0)).current;

  const handleSelectDataset = async (name: string) => {
    setLoading(true);
    setStatusStep(0);
    setUploadStatus(INGEST_STEPS[0]);
    progressWidth.setValue(0);
    
    // Animate through each status step
    for (let i = 0; i < INGEST_STEPS.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setStatusStep(i);
          setUploadStatus(INGEST_STEPS[i]);
          RNAnimated.timing(progressWidth, {
            toValue: ((i + 1) / INGEST_STEPS.length) * 100,
            duration: 400,
            useNativeDriver: false,
          }).start();
          resolve();
        }, i === 0 ? 0 : 700);
      });
    }

    // Final step: create run and navigate
    setTimeout(async () => {
      try {
        const runId = await createRun({ datasetName: name });
        router.push({ pathname: '/timeline', params: { runId } });
      } catch (err) {
        console.error('Failed to create run:', err);
        router.push('/timeline');
      } finally {
        setLoading(false);
        setSelectedFile(null);
      }
    }, 600);
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file.name);
        handleSelectDataset(`Uploaded: ${file.name}`);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.safeArea}>

          {/* Header Section */}
          <RNAnimated.View style={[styles.header, headerAnim]}>
            <AnimatedIcon />
            <ThemedText type="title" style={styles.title}>
              GrowthPilot AI
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
              Your autonomous AI Growth Operator. Ingest data, simulate actions, evaluate outcomes.
            </ThemedText>
          </RNAnimated.View>

          {/* Upload Drop Zone Card */}
          <RNAnimated.View style={[{ width: '100%' }, dropZoneAnim]}>
            <Pressable 
              onPress={handleFileUpload} 
              disabled={loading}
              style={({ pressed }) => [
                styles.dropZone, 
                { 
                  borderColor: theme.backgroundSelected,
                  opacity: pressed ? 0.85 : 1,
                  backgroundColor: pressed ? theme.backgroundElement + '30' : 'transparent',
                }
              ]}
            >
              <RNAnimated.View style={[
                styles.iconPlaceholder, 
                { backgroundColor: theme.backgroundElement, transform: [{ scale: pulseAnim }] }
              ]}>
                <ThemedText type="subtitle" style={{ color: theme.backgroundSelected, fontSize: 28 }}>↑</ThemedText>
              </RNAnimated.View>
              <ThemedText type="default" style={styles.dropZoneTitle}>
                Upload Business Report
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.dropZoneSub}>
                Supports PDF, CSV or Excel files — Click to browse
              </ThemedText>
              {selectedFile && (
                <View style={[styles.fileBadge, { backgroundColor: theme.backgroundSelected + '20' }]}>
                  <ThemedText type="code" style={{ color: theme.backgroundSelected, fontSize: 12 }}>
                    📄 {selectedFile}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          </RNAnimated.View>

          {/* Or Divider */}
          <RNAnimated.View style={[styles.dividerContainer, dividerAnim]}>
            <View style={[styles.dividerLine, { backgroundColor: theme.backgroundElement }]} />
            <ThemedText type="small" themeColor="textSecondary" style={styles.dividerText}>
              OR SELECT DEMO DATASET
            </ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.backgroundElement }]} />
          </RNAnimated.View>

          {/* Demo Cards List */}
          <View style={styles.demoContainer}>
            {/* Card 1 */}
            <RNAnimated.View style={card1Anim}>
              <Pressable
                onPress={() => handleSelectDataset('D2C Shopify Performance Check')}
                disabled={loading}
                style={({ pressed }) => [
                  styles.demoCard,
                  { 
                    backgroundColor: theme.backgroundElement,
                    opacity: pressed ? 0.88 : 1,
                    borderColor: pressed ? theme.backgroundSelected + '50' : 'transparent',
                    borderWidth: 1,
                  }
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardAccent, { backgroundColor: '#0EA5E9' }]} />
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
                <View style={styles.cardFooter}>
                  <View style={[styles.miniTag, { backgroundColor: '#0EA5E920' }]}>
                    <ThemedText type="code" style={{ color: '#0EA5E9', fontSize: 10 }}>4 KPIs</ThemedText>
                  </View>
                  <View style={[styles.miniTag, { backgroundColor: '#F59E0B20' }]}>
                    <ThemedText type="code" style={{ color: '#F59E0B', fontSize: 10 }}>2 Anomalies</ThemedText>
                  </View>
                </View>
              </Pressable>
            </RNAnimated.View>

            {/* Card 2 */}
            <RNAnimated.View style={card2Anim}>
              <Pressable
                onPress={() => handleSelectDataset('B2B SaaS Lead Funnel Diagnostics')}
                disabled={loading}
                style={({ pressed }) => [
                  styles.demoCard,
                  { 
                    backgroundColor: theme.backgroundElement,
                    opacity: pressed ? 0.88 : 1,
                    borderColor: pressed ? theme.backgroundSelected + '50' : 'transparent',
                    borderWidth: 1,
                  }
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardAccent, { backgroundColor: '#818CF8' }]} />
                  <ThemedText type="smallBold" style={[styles.cardBadge, { color: '#818CF8' }]}>
                    SALESFORCE + GOOGLE ADS
                  </ThemedText>
                </View>
                <ThemedText type="default" style={styles.cardTitle}>
                  B2B SaaS Lead Funnel Diagnostics
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.cardDesc}>
                  Diagnoses sudden traffic spikes coupled with lower lead-to-opportunity conversion.
                </ThemedText>
                <View style={styles.cardFooter}>
                  <View style={[styles.miniTag, { backgroundColor: '#818CF820' }]}>
                    <ThemedText type="code" style={{ color: '#818CF8', fontSize: 10 }}>4 KPIs</ThemedText>
                  </View>
                  <View style={[styles.miniTag, { backgroundColor: '#EF444420' }]}>
                    <ThemedText type="code" style={{ color: '#EF4444', fontSize: 10 }}>2 Anomalies</ThemedText>
                  </View>
                </View>
              </Pressable>
            </RNAnimated.View>

            {/* Card 3 */}
            <RNAnimated.View style={card3Anim}>
              <Pressable
                onPress={() => handleSelectDataset('E-commerce Logistics & Retention Analyser')}
                disabled={loading}
                style={({ pressed }) => [
                  styles.demoCard,
                  { 
                    backgroundColor: theme.backgroundElement,
                    opacity: pressed ? 0.88 : 1,
                    borderColor: pressed ? theme.backgroundSelected + '50' : 'transparent',
                    borderWidth: 1,
                  }
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardAccent, { backgroundColor: '#F472B6' }]} />
                  <ThemedText type="smallBold" style={[styles.cardBadge, { color: '#F472B6' }]}>
                    STRIPE + AMAZON FBA
                  </ThemedText>
                </View>
                <ThemedText type="default" style={styles.cardTitle}>
                  Logistics & Retention Analyser
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.cardDesc}>
                  Flags shipping delay anomalies causing refund spikes and customer churn.
                </ThemedText>
                <View style={styles.cardFooter}>
                  <View style={[styles.miniTag, { backgroundColor: '#F472B620' }]}>
                    <ThemedText type="code" style={{ color: '#F472B6', fontSize: 10 }}>4 KPIs</ThemedText>
                  </View>
                  <View style={[styles.miniTag, { backgroundColor: '#FB923C20' }]}>
                    <ThemedText type="code" style={{ color: '#FB923C', fontSize: 10 }}>2 Anomalies</ThemedText>
                  </View>
                </View>
              </Pressable>
            </RNAnimated.View>
          </View>

        </SafeAreaView>
      </ScrollView>

      {/* Premium Loading Overlay */}
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.overlayBackdrop} />
          <View style={styles.overlayContent}>
            {/* Agent Thinking Animation */}
            <View style={styles.thinkingContainer}>
              <View style={[styles.thinkingRing, { borderColor: theme.backgroundSelected }]}>
                <ActivityIndicator size="large" color={theme.backgroundSelected} />
              </View>
            </View>
            
            <ThemedText type="default" style={styles.overlayTitle}>
              AI Pipeline Initializing
            </ThemedText>
            
            <ThemedText type="default" style={[styles.overlayStatus, { color: theme.backgroundSelected }]}>
              {uploadStatus}
            </ThemedText>
            
            {/* Step Progress */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
                <RNAnimated.View style={[
                  styles.progressFill,
                  { 
                    backgroundColor: theme.backgroundSelected,
                    width: progressWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    })
                  }
                ]} />
              </View>
              <ThemedText type="code" style={{ color: theme.textSecondary, fontSize: 11, marginTop: 6 }}>
                Step {statusStep + 1} of {INGEST_STEPS.length}
              </ThemedText>
            </View>

            {/* Step Checklist */}
            <View style={styles.stepList}>
              {INGEST_STEPS.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <ThemedText type="code" style={{ 
                    color: idx < statusStep ? '#14B8A6' : idx === statusStep ? theme.backgroundSelected : theme.textSecondary + '60',
                    fontSize: 12,
                  }}>
                    {idx < statusStep ? '✓' : idx === statusStep ? '●' : '○'}
                  </ThemedText>
                  <ThemedText type="code" style={{ 
                    color: idx <= statusStep ? '#F8FAFC' : theme.textSecondary + '60',
                    fontSize: 12,
                    flex: 1,
                  }}>
                    {step}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
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
    fontSize: 34,
    fontWeight: '700',
    marginTop: Spacing.two,
    letterSpacing: -0.5,
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
    borderRadius: 20,
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.two,
  },
  iconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  fileBadge: {
    marginTop: Spacing.two,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.one,
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
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.one,
    gap: Spacing.two,
  },
  cardAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
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
    lineHeight: 19,
    marginTop: Spacing.one,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  miniTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
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
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
  },
  overlayContent: {
    alignItems: 'center',
    gap: Spacing.three,
    zIndex: 1,
    paddingHorizontal: Spacing.five,
    maxWidth: 400,
    width: '100%',
  },
  thinkingContainer: {
    marginBottom: Spacing.two,
  },
  thinkingRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  overlayStatus: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  progressTrack: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  stepList: {
    width: '100%',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
});
