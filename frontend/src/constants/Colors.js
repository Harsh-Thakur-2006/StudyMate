export const Colors = {
  // Light Theme Colors
  light: {
    primary: '#6366F1', // Indigo
    secondary: '#8B5CF6', // Purple
    accent: '#06B6D4', // Cyan
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red

    background: {
      primary: '#F8FAFC',
      secondary: '#FFFFFF',
    },

    text: {
      primary: '#1E293B',
      secondary: '#475569',
      tertiary: '#64748B',
      inverse: '#FFFFFF',
    },

    border: {
      light: '#E2E8F0',
      medium: '#CBD5E1',
      dark: '#94A3B8',
    },

    glass: {
      background: 'rgba(255, 255, 255, 0.85)',
      border: 'rgba(255, 255, 255, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    }
  },

  // Dark Theme Colors
  dark: {
    primary: '#818CF8', // Light Indigo
    secondary: '#A78BFA', // Light Purple
    accent: '#22D3EE', // Light Cyan
    success: '#34D399', // Light Emerald
    warning: '#FBBF24', // Light Amber
    error: '#F87171', // Light Red

    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
    },

    text: {
      primary: '#F1F5F9',
      secondary: '#E2E8F0',
      tertiary: '#CBD5E1',
      inverse: '#0F172A',
    },

    border: {
      light: '#334155',
      medium: '#475569',
      dark: '#64748B',
    },

    glass: {
      background: 'rgba(30, 41, 59, 0.85)',
      border: 'rgba(255, 255, 255, 0.15)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    }
  }
};

export const Gradients = {
  light: {
    primary: ['#6366F1', '#8B5CF6', '#06B6D4'],
    // Pinkish to bluish gradient
    background: ['#FDF2F8', '#f2bddbff', '#DBEAFE', '#E0F2FE'],
    card: ['#FFFFFF', '#F8FAFC'],
    header: ['#FDF2F8', '#DBEAFE'],
  },
  dark: {
    primary: ['#818CF8', '#A78BFA', '#22D3EE'],
    // Dark purple to dark blue gradient
    background: ['#1E1B4B', '#312E81', '#1E3A8A', '#0C4A6E'],
    card: ['#1E293B', '#0F172A'],
    header: ['#1E1B4B', '#1E3A8A'],
  }
};