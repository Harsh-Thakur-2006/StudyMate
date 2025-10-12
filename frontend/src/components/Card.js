import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const Card = ({
  children,
  style,
  onPress,
  animated = true,
  elevation = 2
}) => {
  const { colors, gradients } = useTheme();
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(1);

  const handlePressIn = () => {
    if (animated && onPress) {
      Animated.spring(scaleValue, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();

      Animated.spring(opacityValue, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && onPress) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      Animated.spring(opacityValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.glass.background,
      borderColor: colors.glass.border,
      shadowColor: colors.glass.shadow,
    },
    animated && {
      transform: [{ scale: scaleValue }],
      opacity: opacityValue,
    },
    style,
  ];

  const content = (
    <Animated.View style={cardStyle}>
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {content}
      </TouchableWithoutFeedback>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    margin: 15,
    marginTop: 0,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
});

export default Card;