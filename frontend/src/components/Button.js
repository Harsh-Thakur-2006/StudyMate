import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({
  title,
  onPress,
  color = 'primary',
  variant = 'filled',
  disabled = false,
  loading = false,
  style,
  ...props
}) => {
  const { colors, gradients } = useTheme();

  const getButtonColors = () => {
    const colorValue = colors[color] || colors.primary;

    if (variant === 'outlined') {
      return {
        background: 'transparent',
        borderColor: colorValue,
        textColor: colorValue,
      };
    }

    return {
      background: colorValue,
      borderColor: colorValue,
      textColor: colors.text.inverse,
    };
  };

  const buttonColors = getButtonColors();

  const ButtonContent = (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColors.background,
          borderColor: buttonColors.borderColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={buttonColors.textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: buttonColors.textColor }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );

  // For filled buttons, add gradient effect
  if (variant === 'filled' && !disabled) {
    return (
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, style]}
      >
        {ButtonContent}
      </LinearGradient>
    );
  }

  return ButtonContent;
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  gradientButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;