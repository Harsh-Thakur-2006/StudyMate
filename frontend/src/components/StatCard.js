import React, { useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const StatCard = ({ number, label, color = 'primary' }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const getColor = () => {
    const colorMap = {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
    };
    return colorMap[color] || colors.primary;
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const statColor = getColor();

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.glass.background,
          borderColor: colors.glass.border,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={[styles.statNumber, { color: statColor }]}>
        {number}
      </Text>
      <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
        {label}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StatCard;