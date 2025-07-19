// app/styles/theme.js - Updated Unified Theme System
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  // Color palette - Consistent across all screens
  colors: {
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
    
    // Text colors
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
      light: 'rgba(255, 255, 255, 0.9)',
      medium: 'rgba(255, 255, 255, 0.7)',
      disabled: '#d1d5db',
      placeholder: 'rgba(0, 0, 0, 0.5)',
      placeholderInverse: 'rgba(255, 255, 255, 0.6)',
    },
    
    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      dark: '#2c3e50', // Main app background
      darker: '#1a252f',
      black: '#000000',
      overlay: 'rgba(0, 0, 0, 0.5)',
      overlayLight: 'rgba(0, 0, 0, 0.3)',
      overlayDark: 'rgba(0, 0, 0, 0.8)',
      glass: 'rgba(255, 255, 255, 0.95)',
      glassLight: 'rgba(255, 255, 255, 0.1)',
      glassMedium: 'rgba(255, 255, 255, 0.15)',
      glassDark: 'rgba(0, 0, 0, 0.4)',
    },
    
    // Border colors
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#6b7280',
      inverse: 'rgba(255, 255, 255, 0.3)',
      focus: '#3b82f6',
      error: '#ef4444',
      success: '#22c55e',
    },
  },
  
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

// Common component styles that can be reused
export const commonStyles = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
  },
  
  // Header styles
  header: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[5],
    alignItems: 'center',
  },
  
  headerTitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes['4xl'],
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  
  headerSubtitle: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.lg,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  // Card styles
  card: {
    backgroundColor: theme.colors.background.glass,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[5],
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
  },
  
  cardHeader: {
    marginBottom: theme.spacing[4],
  },
  
  cardTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  
  cardSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  // Button styles
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...theme.shadows.base,
  },
  
  buttonPrimary: {
    backgroundColor: theme.colors.primary[500],
  },
  
  buttonEmergency: {
    backgroundColor: theme.colors.emergency[500],
    ...theme.shadows.xl,
  },
  
  buttonSuccess: {
    backgroundColor: theme.colors.success[500],
  },
  
  buttonWarrior: {
    backgroundColor: theme.colors.warrior[500],
  },
  
  buttonSecondary: {
    backgroundColor: theme.colors.background.glassMedium,
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
  },
  
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
  },
  
  buttonDisabled: {
    backgroundColor: theme.colors.neutral[400],
    ...theme.shadows.sm,
  },
  
  // Button text styles
  buttonText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  
  buttonTextLarge: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    letterSpacing: theme.typography.letterSpacing.wider,
  },
  
  buttonTextPrimary: {
    color: theme.colors.text.inverse,
  },
  
  buttonTextSecondary: {
    color: theme.colors.text.light,
  },
  
  buttonTextDisabled: {
    color: theme.colors.text.disabled,
  },
  
  // Input styles
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
    ...theme.shadows.sm,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.background.primary,
    ...theme.shadows.base,
  },
  
  inputError: {
    borderColor: theme.colors.emergency[500],
    backgroundColor: theme.colors.emergency[50],
  },
  
  inputSuccess: {
    borderColor: theme.colors.success[500],
    backgroundColor: theme.colors.success[50],
  },
  
  // Text styles
  textPrimary: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSizes.base,
    lineHeight: theme.typography.lineHeights.normal,
  },
  
  textSecondary: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.lineHeights.normal,
  },
  
  textInverse: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.base,
    lineHeight: theme.typography.lineHeights.normal,
  },
  
  textLight: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.base,
    lineHeight: theme.typography.lineHeights.normal,
  },
  
  textError: {
    color: theme.colors.emergency[600],
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  textSuccess: {
    color: theme.colors.success[600],
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  textHelper: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
    marginTop: theme.spacing[4],
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    width: width * 0.9,
    maxHeight: height * 0.8,
    ...theme.shadows.xl,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  
  modalTitle: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  
  modalCloseText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.bold,
  },
  
  // Status and badge styles
  badge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  
  badgeEmergency: {
    backgroundColor: theme.colors.emergency[500],
  },
  
  badgeSuccess: {
    backgroundColor: theme.colors.success[500],
  },
  
  badgeWarning: {
    backgroundColor: theme.colors.warning[500],
  },
  
  badgePrimary: {
    backgroundColor: theme.colors.primary[500],
  },
  
  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  
  // Section styles
  section: {
    marginBottom: theme.spacing[8],
  },
  
  sectionTitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[5],
    paddingHorizontal: theme.spacing[2],
  },
  
  // Bottom navigation
  bottomSection: {
    padding: theme.spacing[6],
    paddingTop: theme.spacing[4],
  },
  
  backButton: {
    backgroundColor: theme.colors.background.glassMedium,
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.base,
  },
  
  backButtonText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
};

export default theme;