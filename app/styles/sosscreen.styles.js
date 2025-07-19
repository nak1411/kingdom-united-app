// app/styles/sosscreen.styles.js
import { StatusBar, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

// Define theme values inline to avoid import issues
const colors = {
  emergency500: '#ef4444',
  emergency600: '#dc2626',
  emergency50: '#fef2f2',
  primary500: '#0ea5e9',
  primary600: '#0284c7',
  success500: '#22c55e',
  success600: '#16a34a',
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
  16: 64,
};

const shadows = {
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

export const sosscreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: StatusBar.currentHeight,
  },

  backgroundimage: {
    flex: 1,
    backgroundColor: '#000000',
  },

  overlay: {
    display: 'none',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: spacing[6],
    paddingBottom: spacing[4],
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  loadingText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '500',
    marginTop: spacing[4],
  },

  // Header section
  header: {
    alignItems: 'center',
    marginBottom: spacing[10],
    paddingTop: spacing[6],
  },

  title: {
    color: colors.textInverse,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing[3],
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    color: colors.textLight,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing[4],
    fontWeight: '500',
  },

  zipInfo: {
    color: colors.textLight,
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing[2],
    fontStyle: 'italic',
    opacity: 0.9,
  },

  // Prayer input section
  inputSection: {
    marginBottom: spacing[6],
  },

  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: spacing[6],
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },

  inputLabel: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },

  characterCount: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },

  characterCountWarning: {
    color: colors.emergency500,
  },

  // Modern text input
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 12,
    padding: spacing[5],
    fontSize: 16,
    lineHeight: 24,
    minHeight: 160,
    textAlignVertical: 'top',
    color: colors.textPrimary,
    ...shadows.sm,
  },

  inputFocused: {
    borderColor: colors.primary500,
    backgroundColor: colors.backgroundPrimary,
    ...shadows.base,
  },

  inputError: {
    borderColor: colors.emergency500,
    backgroundColor: colors.emergency50,
  },

  // Helper text
  errorText: {
    color: colors.emergency600,
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing[2],
    marginLeft: spacing[1],
  },

  helperText: {
    color: colors.success600,
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing[2],
    marginLeft: spacing[1],
  },

  // Guidelines section
  guidelinesSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: spacing[5],
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  guidelinesTitle: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing[3],
  },

  guidelinesText: {
    color: colors.textLight,
    fontSize: 16,
    lineHeight: 24,
  },

  // Button section
  buttonSection: {
    padding: spacing[6],
    paddingTop: spacing[4],
    gap: spacing[4],
  },

  // Modern clear button
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.base,
  },

  clearButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Modern send button
  sendButton: {
    backgroundColor: colors.emergency500,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[8],
    borderRadius: 16,
    alignItems: 'center',
    ...shadows.xl,
    position: 'relative',
    overflow: 'hidden',
  },

  sendButtonDisabled: {
    backgroundColor: colors.neutral400,
    ...shadows.sm,
  },

  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendingText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: spacing[3],
    letterSpacing: 1,
  },

  sendButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  sendButtonTextDisabled: {
    color: colors.textDisabled,
  },

  // Modern back button
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[6],
    borderRadius: 12,
    alignItems: 'center',
  },

  backButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Progress indicator for character count
  progressContainer: {
    marginTop: spacing[3],
    backgroundColor: '#e5e7eb',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: colors.primary500,
    borderRadius: 2,
  },

  progressBarWarning: {
    backgroundColor: colors.emergency500,
  },

  // Emergency indicator
  emergencyIndicator: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    backgroundColor: colors.emergency500,
    borderRadius: 50,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.base,
  },

  emergencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textInverse,
    marginRight: spacing[2],
  },

  emergencyText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Tips section
  tipsSection: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 12,
    padding: spacing[5],
    marginBottom: spacing[6],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary500,
  },

  tipsTitle: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing[2],
  },

  tipsText: {
    color: colors.textLight,
    fontSize: 14,
    lineHeight: 20,
  },
});