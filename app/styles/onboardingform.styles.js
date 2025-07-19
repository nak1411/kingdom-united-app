// app/styles/onboardingform.styles.js
import { StatusBar, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

// Define theme values inline
const colors = {
  primary500: '#0ea5e9',
  emergency500: '#ef4444',
  emergency600: '#dc2626',
  emergency50: '#fef2f2',
  success500: '#22c55e',
  success600: '#16a34a',
  success50: '#f0fdf4',
  neutral400: '#a3a3a3',
  textInverse: '#ffffff',
  textLight: 'rgba(255, 255, 255, 0.9)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textDisabled: '#d1d5db',
  backgroundDarker: '#111827',
  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f9fafb',
  borderLight: '#e5e7eb',
};

const spacing = {
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
};

const shadows = {
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
};

export const onboardingformStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: StatusBar.currentHeight,
  },

  backgroundimage: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#000000',
  },

  overlay: {
    display: 'none',
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[16],
    paddingBottom: spacing[10],
    justifyContent: 'space-between',
  },

  // Header section
  header: {
    alignItems: 'center',
    marginBottom: spacing[16],
  },

  title: {
    color: colors.textInverse,
    fontWeight: 'bold',
    fontSize: 48,
    marginBottom: spacing[4],
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    color: colors.textLight,
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: spacing[6],
    lineHeight: 28,
    fontWeight: '500',
  },

  // Welcome animation container
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },

  welcomeIcon: {
    fontSize: 80,
    marginBottom: spacing[4],
  },

  // Input section with modern glass morphism
  inputSection: {
    marginBottom: spacing[10],
  },

  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: spacing[8],
    ...shadows.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  inputLabel: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing[4],
    textAlign: "center",
    letterSpacing: 2,
  },

  // Modern input with enhanced styling
  input: {
    backgroundColor: colors.backgroundSecondary,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: "center",
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[6],
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.borderLight,
    ...shadows.base,
    letterSpacing: 4,
  },

  inputFocused: {
    borderColor: colors.primary500,
    backgroundColor: colors.backgroundPrimary,
    ...shadows.lg,
  },

  inputError: {
    borderColor: colors.emergency500,
    backgroundColor: colors.emergency50,
  },

  inputChanged: {
    borderColor: colors.success500,
    backgroundColor: colors.success50,
  },

  // Helper text
  errorText: {
    color: colors.emergency600,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing[3],
    fontWeight: '500',
  },

  helperText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing[3],
    fontWeight: '500',
  },

  changedText: {
    color: colors.success600,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing[3],
    fontWeight: '600',
  },

  // Progress indicator
  progressSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },

  progressContainer: {
    width: width * 0.6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: colors.primary500,
    borderRadius: 3,
  },

  progressText: {
    color: colors.textLight,
    fontSize: 14,
    marginTop: spacing[2],
    fontWeight: '500',
  },

  // Info section with enhanced styling
  infoSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    padding: spacing[6],
    marginBottom: spacing[8],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  infoText: {
    color: colors.textLight,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: '500',
  },

  // Button section
  buttonSection: {
    gap: spacing[4],
    alignItems: 'center',
  },

  // Modern finish button
  finishButton: {
    backgroundColor: colors.success500,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[12],
    borderRadius: 16,
    minWidth: width * 0.8,
    alignItems: "center",
    ...shadows.xl,
    position: 'relative',
    overflow: 'hidden',
  },

  finishButtonDisabled: {
    backgroundColor: colors.neutral400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  finishButtonText: {
    color: colors.textInverse,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  finishButtonTextDisabled: {
    color: colors.textDisabled,
  },

  // Skip button (modern ghost button)
  skipButton: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  skipButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: "underline",
  },

  // Feature highlights
  featuresSection: {
    marginBottom: spacing[8],
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  featureIcon: {
    fontSize: 24,
    marginRight: spacing[4],
  },

  featureText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },

  // Loading overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  loadingContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: spacing[8],
    alignItems: 'center',
    minWidth: width * 0.6,
    ...shadows.xl,
  },

  loadingText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing[4],
  },

  // Security note
  securityNote: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderRadius: 12,
    padding: spacing[4],
    marginTop: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary500,
  },

  securityText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});