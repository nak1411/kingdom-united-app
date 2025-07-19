// app/styles/homescreen.styles.js - Updated with Unified Theme
import { StatusBar, StyleSheet } from "react-native";
import { theme, commonStyles } from './theme';

export const homescreenStyles = StyleSheet.create({
  // Base container
  container: {
    ...commonStyles.container,
    paddingTop: StatusBar.currentHeight,
  },

  // Logo section
  logoContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
    maxHeight: theme.dimensions.height * 0.2,
  },

  logoimage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'center',
  },

  brandText: {
    fontSize: theme.typography.fontSizes['6xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    textShadowColor: theme.colors.background.overlay,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  brandSubtext: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginTop: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Main content layout
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[10],
  },

  // SOS Button - Big Red Circle (Central focus)
  sosButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing[20],
    position: 'relative',
  },

  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.emergency[500],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Enhanced red emergency shadow
    shadowColor: theme.colors.emergency[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
    // Additional glow effect
    borderWidth: 3,
    borderColor: theme.colors.emergency[400],
  },

  sosButtonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 25,
  },

  sosButtonInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative',
  },

  sosButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 42,
    fontWeight: theme.typography.fontWeights.black,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: theme.typography.letterSpacing.widest,
    textAlign: 'center',
  },

  sosButtonSubtext: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    marginTop: theme.spacing[1],
    textAlign: 'center',
    position: 'absolute',
    bottom: -theme.spacing[6],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Animated pulse rings for emergency effect
  pulseContainer: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: `${theme.colors.emergency[500]}40`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pulseRing1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: `${theme.colors.emergency[500]}30`,
  },

  pulseRing2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: `${theme.colors.emergency[500]}20`,
  },

  // Navigation buttons section
  navigationSection: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[4],
  },

  // Unified navigation button style
  navButton: {
    ...commonStyles.button,
    backgroundColor: theme.colors.background.glassMedium,
    borderWidth: 1,
    borderColor: theme.colors.border.inverse,
    width: '90%',
    maxWidth: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[4],
    minHeight: 52,
  },

  navButtonPressed: {
    backgroundColor: theme.colors.background.glassLight,
    transform: [{ scale: 0.98 }],
  },

  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  navButtonIcon: {
    fontSize: theme.typography.fontSizes['2xl'],
    marginRight: theme.spacing[3],
  },

  navButtonText: {
    ...commonStyles.buttonText,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.lg,
    flex: 1,
  },

  navButtonArrow: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.light,
  },

  // Specific button variants
  requestsButton: {
    backgroundColor: `${theme.colors.primary[500]}30`,
    borderColor: `${theme.colors.primary[500]}60`,
  },

  requestsButtonIcon: {
    color: theme.colors.primary[400],
  },

  warriorBookButton: {
    backgroundColor: `${theme.colors.warrior[500]}30`,
    borderColor: `${theme.colors.warrior[500]}60`,
  },

  warriorBookButtonIcon: {
    color: theme.colors.warrior[400],
  },

  settingsButton: {
    backgroundColor: `${theme.colors.neutral[500]}30`,
    borderColor: `${theme.colors.neutral[500]}60`,
  },

  settingsButtonIcon: {
    color: theme.colors.neutral[400],
  },

  // Status indicators
  statusIndicator: {
    position: 'absolute',
    top: theme.spacing[12],
    right: theme.spacing[6],
    backgroundColor: theme.colors.success[500],
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.base,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.inverse,
    marginRight: theme.spacing[2],
  },

  statusText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
  },

  // Quick stats (if needed)
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.background.glassDark,
    marginHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[6],
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
  },

  statLabel: {
    color: theme.colors.text.light,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    marginTop: theme.spacing[1],
  },

  // Legacy button styles for compatibility
  requestsbutton: {
    backgroundColor: `${theme.colors.primary[500]}30`,
    borderColor: `${theme.colors.primary[500]}60`,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing[4],
    ...theme.shadows.base,
  },

  warriorbookbutton: {
    backgroundColor: `${theme.colors.warrior[500]}30`,
    borderColor: `${theme.colors.warrior[500]}60`,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing[4],
    ...theme.shadows.base,
  },

  settingsbutton: {
    backgroundColor: `${theme.colors.neutral[500]}30`,
    borderColor: `${theme.colors.neutral[500]}60`,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    ...theme.shadows.base,
  },

  // Bottom section
  bottomSection: {
    ...commonStyles.bottomSection,
  },

  // Responsive design adjustments
  ...(theme.dimensions.isSmallScreen && {
    logoContainer: {
      flex: 0.6,
      paddingTop: theme.spacing[2],
      paddingBottom: theme.spacing[1],
    },
    
    sosButtonContainer: {
      marginVertical: theme.spacing[4],
    },
    
    sosButton: {
      width: 160,
      height: 160,
      borderRadius: 80,
    },
    sosButtonInner: {
      width: 140,
      height: 140,
      borderRadius: 70,
    },
    sosButtonText: {
      fontSize: 36,
    },
    sosButtonSubtext: {
      bottom: -theme.spacing[5],
      fontSize: theme.typography.fontSizes.xs,
    },
    pulseContainer: {
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    pulseRing1: {
      width: 180,
      height: 180,
      borderRadius: 90,
    },
    pulseRing2: {
      width: 220,
      height: 220,
      borderRadius: 110,
    },
    navigationSection: {
      gap: theme.spacing[2],
    },
    navButton: {
      paddingVertical: theme.spacing[3],
      minHeight: 48,
    },
    navButtonText: {
      fontSize: theme.typography.fontSizes.sm,
    },
  }),
});