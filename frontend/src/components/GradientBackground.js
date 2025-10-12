import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const GradientBackground = ({ children, style }) => {
  const { gradients } = useTheme();

  return (
    <LinearGradient
      colors={gradients.background}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }} // Top left
      end={{ x: 1, y: 1 }}   // Bottom right
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;