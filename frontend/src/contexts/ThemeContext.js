import React, { createContext, useContext, useState, useEffect } from 'react';
import { Colors, Gradients } from '../constants/Colors';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Get current theme colors and gradients
  const colors = isDark ? Colors.dark : Colors.light;
  const gradients = isDark ? Gradients.dark : Gradients.light;

  const theme = {
    isDark,
    toggleTheme,
    colors,
    gradients,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};