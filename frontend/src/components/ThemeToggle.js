import React, { useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ style }) => {
  const { isDark, toggleTheme, colors } = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate: rotateInterpolate }] }, style]}>
      <TouchableOpacity
        onPress={handleToggle}
        style={[
          styles.toggleButton,
          { backgroundColor: colors.glass.background, borderColor: colors.glass.border }
        ]}
      >
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ThemeToggle;