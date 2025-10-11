import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function NeonButton({ title, onPress, color = '#00ffff', style }) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: `${color}20`, borderColor: color },
        style
      ]} 
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});