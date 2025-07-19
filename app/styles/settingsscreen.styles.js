// app/styles/settingsscreen.styles.js
import { StatusBar, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

// Define theme values inline
const colors = {
  primary500: '#0ea5e9',
  primary50: '#f0f9ff',
  emergency500: '#ef4444',
  emergency600: '#dc2626',
  emergency50: '#fef2f2',
  success500: '#22c55e',
  success600: '#16a34a',
  neutral300: '#d4d4d4',
  neutral500: '#737373',
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
  12: 48,
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
};

export const settingsscreenStyles = StyleSheet.create({
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
    marginBottom: spacing[12],
    paddingTop: spacing[6],
  },

  title: {
    color: colors.textInverse,
    fontWeight: 'bold',
    fontSize: 36,
    marginBottom: spacing[3],
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    color: colors.textLight,
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: '500',
  },

  // Section containers
  section: {
    marginBottom: spacing[8],
  },

  sectionTitle: {
    color: colors.textInverse,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing[5],
    paddingHorizontal: spacing[2],
  },

  // Current location card
  currentLocationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: spacing[8],
    alignItems: 'center',
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  currentLocationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: spacing[2],
  },

  currentLocationValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing[3],
    letterSpacing: 2,
  },

  currentLocationNote: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },

  // Input card for updating location
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: spacing[8],
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  inputLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: spacing[4],
    textAlign: 'center',
  },

  // Modern input styling
  input: {
    backgroundColor: colors.backgroundSecondary,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: "center",
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[6],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    marginBottom: spacing[3],
    ...shadows.sm,
    letterSpacing: 2,
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

  inputChanged: {
    borderColor: colors.primary500,
    backgroundColor: colors.primary50,
  },

  // Helper text
  errorText: {
    color: colors.emergency600,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing[2],
    fontWeight: '500',
  },

  helperText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing[2],
    fontWeight: '500',
  },

  changedText: {
    color: colors.success600,
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing[2],
    fontWeight: '600',
  },

  // Zip code action buttons
  zipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[5],
    gap: spacing[3],
  },

  cancelButton: {
    flex: 1,
    backgroundColor: colors.neutral500,
    paddingVertical: spacing[4],
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.base,
  },

  cancelButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },

  saveButton: {
    flex: 1,
    backgroundColor: colors.primary500,
    paddingVertical: spacing[4],
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.base,
  },

  saveButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },

  saveButtonDisabled: {
    backgroundColor: colors.neutral300,
    ...shadows.sm,
  },

  saveButtonTextDisabled: {
    color: colors.textDisabled,
  },

  // Action cards for app management
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: spacing[6],
    marginBottom: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  actionCardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ scale: 0.98 }],
  },

  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.emergency500,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },

  actionDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  actionArrow: {
    fontSize: 24,
    color: colors.textSecondary,
    marginLeft: spacing[4],
  },

  // Info section
  infoSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    padding: spacing[6],
    marginBottom: spacing[6],
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

  // Bottom section
  bottomSection: {
    padding: spacing[6],
    paddingTop: spacing[4],
  },

  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[8],
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.base,
  },

  backButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Status indicators
  statusSection: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderRadius: 12,
    padding: spacing[5],
    marginBottom: spacing[6],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary500,
  },

  statusTitle: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing[3],
  },

  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },

  statusLabel: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '500',
  },

  statusValue: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },

  // Toggle switches (if needed)
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: spacing[5],
    marginBottom: spacing[3],
    ...shadows.sm,
  },

  toggleLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },

  toggleDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing[1],
  },

  // Reset button style
  resetbutton: {
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "gray",
    backgroundColor: "#004060",
    width: 250,
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
  },

  backbutton: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "gray",
    backgroundColor: "#004060",
    width: 250,
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
  },

  currentzip: {
    color: "black",
    fontSize: 30,
    paddingTop: 50,
    textAlign: "center",
  },
});