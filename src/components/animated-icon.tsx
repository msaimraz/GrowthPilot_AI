import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.backgroundSolidColor} />
  );
}

export function AnimatedIcon() {
  const pulseAnim = useRef(new Animated.Value(0.96)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth pulsing loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Constant rotation loop for orbital path
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.iconContainer}>
      {/* Glow Backdrop */}
      <Animated.View style={[styles.glowWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <Defs>
            <LinearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>
          <Circle cx="60" cy="60" r="54" fill="url(#glowGrad)" />
        </Svg>
      </Animated.View>

      {/* Rotating Dotted Orbital Ring */}
      <Animated.View style={[styles.absoluteFill, { transform: [{ rotate: spin }] }]}>
        <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <Defs>
            <LinearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#8B5CF6" />
              <Stop offset="50%" stopColor="#6366F1" />
              <Stop offset="100%" stopColor="#06B6D4" />
            </LinearGradient>
          </Defs>
          <Circle 
            cx="60" 
            cy="60" 
            r="46" 
            stroke="url(#accentGrad)" 
            strokeWidth="1.5" 
            strokeDasharray="6,4"
            opacity="0.6"
          />
        </Svg>
      </Animated.View>

      {/* Main Brand Wings & Upward Jet */}
      <View style={styles.absoluteFill}>
        <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <Defs>
            <LinearGradient id="accentGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#8B5CF6" />
              <Stop offset="50%" stopColor="#6366F1" />
              <Stop offset="100%" stopColor="#06B6D4" />
            </LinearGradient>
          </Defs>

          {/* Steering Wheel/Compass Ring */}
          <Circle 
            cx="60" 
            cy="60" 
            r="38" 
            stroke="url(#accentGrad2)" 
            strokeWidth="2.5" 
            opacity="0.8"
          />

          {/* Compass Steering Ticks */}
          <Path d="M60 18 L60 24" stroke="url(#accentGrad2)" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M60 96 L60 102" stroke="url(#accentGrad2)" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M18 60 L24 60" stroke="url(#accentGrad2)" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M96 60 L102 60" stroke="url(#accentGrad2)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Pilot Wings & Growth Jet Emblem */}
          <G transform="translate(30, 30) scale(0.5)">
            <Path 
              d="M10 50 C30 22, 90 22, 110 50 C90 78, 30 78, 10 50 Z" 
              fill="none" 
              stroke="url(#accentGrad2)" 
              strokeWidth="4" 
              opacity="0.55" 
            />
            {/* Soaring Rocket/Jet */}
            <Path 
              d="M60 15 L85 85 L60 70 L35 85 Z" 
              fill="url(#accentGrad2)" 
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Orange thrust flame */}
            <Path 
              d="M52 75 L60 95 L68 75 Z" 
              fill="#FB7185" 
            />
          </G>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowWrapper: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundSolidColor: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070A13',
    zIndex: 1000,
  },
});
