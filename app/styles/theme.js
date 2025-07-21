// app/styles/theme.js - Enhanced Theme System with Dark/Light Mode
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base color palette
const colors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Emergency/SOS colors
  emergency: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main emergency red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning orange
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Warrior Book purple theme
  warrior: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main warrior purple
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

// Dark theme configuration
const darkTheme = {
  colors: {
    ...colors,
    
    // Text colors for dark theme
    text: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      tertiary: '#9ca3af',
      inverse: '#111827',
      light: 'rgba(255, 255, 255, 0.9)',
      medium: 'rgba(255, 255, 255, 0.7)',
      disabled: '#6b7280',
      placeholder: 'rgba(255, 255, 255, 0.5)',
      placeholderInverse: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Background colors for dark theme
    background: {
      primary: '#1f2937',
      secondary: '#374151',
      tertiary: '#4b5563',
      dark: '#2c3e50', // Main app background
      darker: '#1a252f',
      black: '#000000',
      overlay: 'rgba(0, 0, 0, 0.7)',
      overlayLight: 'rgba(0, 0, 0, 0.5)',
      overlayDark: 'rgba(0, 0, 0, 0.9)',
      glass: 'rgba(255, 255, 255, 0.95)',
      glassLight: 'rgba(255, 255, 255, 0.1)',
      glassMedium: 'rgba(255, 255, 255, 0.15)',
      glassDark: 'rgba(0, 0, 0, 0.4)',
      card: '#374151', // Dark theme cards
    },
    
    // Border colors for dark theme
    border: {
      light: '#4b5563',          // Lighter borders for dark theme
      medium: '#6b7280',         // Medium borders
      dark: '#9ca3af',           // Darker borders for contrast
      inverse: 'rgba(255, 255, 255, 0.3)',  // Light borders on dark
      focus: '#3b82f6',
      error: '#ef4444',
      success: '#22c55e',
    },
  },
};

// Light theme configuration
const lightTheme = {
  colors: {
    ...colors,
    
    // Text colors for light theme - FIXED for readability
    text: {
      primary: '#111827',        // Dark text on light backgrounds
      secondary: '#374151',      // Medium dark for secondary text
      tertiary: '#6b7280',       // Gray for tertiary text
      inverse: '#ffffff',        // White text (for dark buttons/cards)
      light: '#6b7280',          // Gray text instead of light
      medium: '#9ca3af',         // Medium gray
      disabled: '#d1d5db',       // Light gray for disabled
      placeholder: '#9ca3af',    // Gray placeholder text
      placeholderInverse: 'rgba(255, 255, 255, 0.6)',
    },
    
    // Background colors for light theme
    background: {
      primary: '#ffffff',        // Pure white
      secondary: '#f9fafb',      // Very light gray
      tertiary: '#f3f4f6',       // Light gray
      dark: '#ffffff',           // Main app background (white)
      darker: '#f9fafb',         // Slightly gray
      black: '#111827',          // Dark for contrast
      overlay: 'rgba(0, 0, 0, 0.5)',
      overlayLight: 'rgba(0, 0, 0, 0.3)',
      overlayDark: 'rgba(0, 0, 0, 0.8)',
      glass: 'rgba(255, 255, 255, 0.95)',
      glassLight: 'rgba(0, 0, 0, 0.05)',      // Very subtle
      glassMedium: 'rgba(0, 0, 0, 0.08)',     // Slightly more visible
      glassDark: 'rgba(0, 0, 0, 0.15)',       // More noticeable
      card: '#ffffff',
    },
    
    // Border colors for light theme
    border: {
      light: '#e5e7eb',          // Light gray borders
      medium: '#d1d5db',         // Medium gray borders
      dark: '#9ca3af',           // Darker borders for contrast
      inverse: 'rgba(0, 0, 0, 0.15)',  // Dark borders on light
      focus: '#3b82f6',
      error: '#ef4444',
      success: '#22c55e',
    },
  },
};

// Shared theme properties (same for both themes)
const sharedTheme = {
  // Typography scale
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
      '6xl': 48,
      '7xl': 60,
    },
    
    fontWeights: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    lineHeights: {
      tight: 20,
      normal: 24,
      relaxed: 28,
      loose: 32,
    },
    
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
      widest: 2,
    },
  },
  
  // Spacing scale (4px base unit)
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 6,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  
  // Consistent shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 10,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  
  // Screen dimensions
  dimensions: {
    width,
    height,
    isSmallScreen: width < 375,
    isMediumScreen: width >= 375 && width < 414,
    isLargeScreen: width >= 414,
  },
};

// Create complete themes by merging shared properties
export const themes = {
  dark: {
    ...sharedTheme,
    ...darkTheme,
    isDark: true,
  },
  light: {
    ...sharedTheme,
    ...lightTheme,
    isDark: false,
  },
};

// Default theme (dark)
export const theme = themes.dark;

// Common component styles that adapt to theme
export const createCommonStyles = (currentTheme) => ({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: currentTheme.colors.background.dark,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: currentTheme.colors.background.dark,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: currentTheme.spacing[6],
  },
  
  // Header styles
  header: {
    paddingHorizontal: currentTheme.spacing[6],
    paddingVertical: currentTheme.spacing[5],
    alignItems: 'center',
  },
  
  headerTitle: {
    color: currentTheme.colors.text.primary,
    fontSize: currentTheme.typography.fontSizes['4xl'],
    fontWeight: currentTheme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: currentTheme.spacing[2],
  },
  
  headerSubtitle: {
    color: currentTheme.colors.text.secondary,
    fontSize: currentTheme.typography.fontSizes.lg,
    textAlign: 'center',
    fontWeight: currentTheme.typography.fontWeights.medium,
  },
  
  // Card styles
  card: {
    backgroundColor: currentTheme.colors.background.card,
    borderRadius: currentTheme.borderRadius.lg,
    padding: currentTheme.spacing[6],
    marginBottom: currentTheme.spacing[5],
    ...currentTheme.shadows.lg,
    borderWidth: 1,
    borderColor: currentTheme.colors.border.light,
  },
  
  // Button styles
  button: {
    borderRadius: currentTheme.borderRadius.md,
    paddingVertical: currentTheme.spacing[4],
    paddingHorizontal: currentTheme.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...currentTheme.shadows.base,
  },
  
  buttonPrimary: {
    backgroundColor: currentTheme.colors.primary[500],
  },
  
  buttonEmergency: {
    backgroundColor: currentTheme.colors.emergency[500],
    ...currentTheme.shadows.xl,
  },
  
  buttonSuccess: {
    backgroundColor: currentTheme.colors.success[500],
  },
  
  buttonWarrior: {
    backgroundColor: currentTheme.colors.warrior[500],
  },
  
  buttonSecondary: {
    backgroundColor: currentTheme.colors.background.glassMedium,
    borderWidth: 1,
    borderColor: currentTheme.colors.border.inverse,
  },
  
  buttonText: {
    fontSize: currentTheme.typography.fontSizes.base,
    fontWeight: currentTheme.typography.fontWeights.semibold,
    letterSpacing: currentTheme.typography.letterSpacing.wide,
    color: currentTheme.colors.text.inverse,
  },
  
  // Input styles
  input: {
    backgroundColor: currentTheme.colors.background.secondary,
    borderWidth: 2,
    borderColor: currentTheme.colors.border.light,
    borderRadius: currentTheme.borderRadius.md,
    paddingVertical: currentTheme.spacing[4],
    paddingHorizontal: currentTheme.spacing[4],
    fontSize: currentTheme.typography.fontSizes.base,
    color: currentTheme.colors.text.primary,
    ...currentTheme.shadows.sm,
  },
  
  // Text styles
  textPrimary: {
    color: currentTheme.colors.text.primary,
    fontSize: currentTheme.typography.fontSizes.base,
    lineHeight: currentTheme.typography.lineHeights.normal,
  },
  
  textSecondary: {
    color: currentTheme.colors.text.secondary,
    fontSize: currentTheme.typography.fontSizes.sm,
    lineHeight: currentTheme.typography.lineHeights.normal,
  },
});

export default theme;