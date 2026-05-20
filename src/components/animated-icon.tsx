import { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View, Animated as RNAnimated } from 'react-native';
import Svg, { Polygon, Path } from 'react-native-svg';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;
const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={styles.backgroundSolidColor} />
  );
}

export function AnimatedIcon() {
  const pulseAnim = useRef(new RNAnimated.Value(0.95)).current;
  const rotateAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    // Pulse loop for the background hexagon
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 0.95, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Rotate loop for the inner sparkle star
    RNAnimated.loop(
      RNAnimated.timing(rotateAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.iconContainer}>
      {/* Dynamic 3D Hexagon SVG Wrapper */}
      <RNAnimated.View style={[styles.logoWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {/* Main Blue Hexagon Outline & Glow Shadow */}
          <Polygon 
            points="60,10 105,35 105,85 60,110 15,85 15,35" 
            fill="#4285F4" 
            stroke="#1E293B"
            strokeWidth="3.5"
          />
          {/* Layered Inner Hexagon Accent for premium 3D Depth */}
          <Polygon 
            points="60,20 95,40 95,80 60,100 25,80 25,40" 
            fill="#2F75E8"
          />
        </Svg>

        {/* Pulsing & Spinning Sparkle Star (Gemini / AI Seekho Core Brand Emblem) */}
        <RNAnimated.View style={[styles.sparkleContainer, { transform: [{ rotate: spin }] }]}>
          <Svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z" 
              fill="#FFFFFF" 
            />
          </Svg>
        </RNAnimated.View>
      </RNAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    zIndex: 100,
    marginBottom: 8,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  sparkleContainer: {
    position: 'absolute',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundSolidColor: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    zIndex: 1000,
  },
});
