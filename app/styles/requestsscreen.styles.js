// app/styles/requestsscreen.styles.js
import { StatusBar, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

// Define theme values inline
const colors = {
  primary500: '#0ea5e9',
  primary600: '#0284c7',
  primary100: '#e0f2fe',
  primary300: '#7dd3fc',
  emergency500: '#ef4444',
  secondary500: '#d946ef',
  success500: '#22c55e',
  textInverse: '#ffffff',
  textLight: 'rgba(255, 255, 255, 0.9)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
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
  20: 80,
  24: 96,
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
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
};

export const requestsscreenStyles = StyleSheet.create({
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

  // Header section
  header: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[5],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    color: colors.textInverse,
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: spacing[1],
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  subtitle: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '500',
  },

  // Real-time toggle
  realTimeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  realTimeToggleText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Real-time status bar
  realTimeStatus: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing[2],
  },

  statusText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '500',
    marginRight: spacing[3],
  },

  lastUpdateText: {
    color: colors.textLight,
    fontSize: 12,
    opacity: 0.8,
  },

  newPrayersNotification: {
    backgroundColor: colors.emergency500,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 50,
    ...shadows.base,
  },

  newPrayersText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Content area
  content: {
    flex: 1,
    marginHorizontal: spacing[3],
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },

  loadingText: {
    color: colors.textInverse,
    marginTop: spacing[4],
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Feed container
  feedContainer: {
    paddingBottom: spacing[6],
  },

  // Modern prayer item cards
  prayerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: spacing[3],
    marginVertical: spacing[2],
    borderRadius: 16,
    padding: spacing[5],
    ...shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  recentPrayerItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success500,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    ...shadows.lg,
  },

  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
    ...shadows.sm,
  },

  avatarText: {
    fontSize: 18,
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },

  timestamp: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Badges section
  badges: {
    alignItems: 'flex-end',
    gap: spacing[2],
  },

  newBadge: {
    backgroundColor: colors.success500,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    ...shadows.sm,
  },

  newBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  prayerBadge: {
    backgroundColor: colors.emergency500,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 50,
    ...shadows.sm,
  },

  prayerBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },

  urgentBadge: {
    backgroundColor: colors.secondary500,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 50,
  },

  urgentBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Prayer content
  prayerContent: {
    marginBottom: spacing[4],
  },

  prayerText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    fontWeight: 'normal',
  },

  readMore: {
    color: colors.primary600,
    fontSize: 14,
    marginTop: spacing[2],
    fontWeight: '600',
  },

  // Prayer actions
  prayerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing[2],
  },

  actionButton: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    ...shadows.sm,
  },

  actionButtonPressed: {
    backgroundColor: colors.primary100,
    transform: [{ scale: 0.95 }],
  },

  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  actionTextActive: {
    color: colors.primary600,
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[10],
  },

  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing[6],
    opacity: 0.8,
  },

  emptyStateTitle: {
    color: colors.textInverse,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing[4],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  emptyStateText: {
    color: colors.textLight,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[6],
    fontWeight: '500',
  },

  settingsButton: {
    backgroundColor: colors.primary500,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: 12,
    ...shadows.base,
  },

  settingsButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },

  // Error state
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[10],
  },

  errorStateIcon: {
    fontSize: 64,
    marginBottom: spacing[6],
    opacity: 0.8,
  },

  errorStateTitle: {
    color: colors.textInverse,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing[4],
  },

  errorStateText: {
    color: colors.textLight,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[6],
  },

  retryButton: {
    backgroundColor: colors.success500,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: 12,
    ...shadows.base,
  },

  retryButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
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

  // Original styles for compatibility
  backbutton: {
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

  input: {
    color: "black",
    backgroundColor: "white",
    height: 200,
    margin: 12,
    padding: 100,
    borderWidth: 2,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: colors.backgroundPrimary,
    marginHorizontal: spacing[6],
    borderRadius: 24,
    maxHeight: '85%',
    width: width * 0.9,
    ...shadows.xl,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },

  closeButtonText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },

  modalBody: {
    padding: spacing[6],
  },

  modalPrayerHeader: {
    marginBottom: spacing[5],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  modalTimestamp: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing[2],
    fontWeight: '500',
  },

  modalPrayerId: {
    fontSize: 14,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },

  modalPrayerText: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.textPrimary,
    marginBottom: spacing[6],
    fontWeight: 'normal',
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing[5],
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing[3],
  },

  modalActionButton: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    ...shadows.sm,
  },

  modalActionButtonPressed: {
    backgroundColor: colors.primary100,
    borderColor: colors.primary300,
  },

  modalActionText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  modalActionTextActive: {
    color: colors.primary600,
  },

  // Floating refresh button
  floatingRefresh: {
    position: 'absolute',
    bottom: spacing[24],
    right: spacing[6],
    backgroundColor: colors.primary500,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },

  floatingRefreshIcon: {
    color: colors.textInverse,
    fontSize: 20,
  },
});