// app/styles/homescreen.styles.js
import { StatusBar, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

// Define theme colors and spacing inline since we can't import complex objects
const colors = {
  emergency500: '#ef4444',
  primary500: '#0ea5e9',
  success500: '#22c55e',
  neutral500: '#737373',
  warrior500: '#8b5cf6', // Purple for warrior book
  textInverse: '#ffffff',
  textLight: 'rgba(255, 255, 255, 0.9)',
  backgroundDarker: '#111827',
  backgroundSecondary: '#f9fafb',
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
  16: 64,
  20: 80,
};

const shadows = {
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

export const homescreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: StatusBar.currentHeight,
  },

  backgroundimage: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Overlay removed since we're using solid black background
  overlay: {
    display: 'none',
  },

  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
  },

  logoimage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'center',
  },

  // Brand text (if no logo image)
  brandText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textInverse,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  brandSubtext: {
    fontSize: 18,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing[2],
    fontWeight: '500',
  },

  // Create a complete centered layout structure
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: spacing[8],
  },

  // Modern SOS button with glass morphism effect - PROPERLY CENTERED
  sosbutton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.emergency500,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Ensures horizontal centering
    marginVertical: spacing[8], // Equal spacing above and below
    position: 'relative',
    ...shadows.xl,
  },

  sosButtonInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  sosButtonText: {
    color: colors.textInverse,
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },

  sosButtonSubtext: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing[1],
    textAlign: 'center',
  },

  // Pulse animation container for SOS button
  pulseContainer: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navigationSection: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
    width: '100%',
    alignItems: 'center',
  },

  // Modern navigation buttons - properly centered
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '90%',
    maxWidth: 300,
    marginBottom: spacing[4],
    ...shadows.md,
  },

  navButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    transform: [{ scale: 0.98 }],
  },

  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  navButtonIcon: {
    width: 24,
    height: 24,
    marginRight: spacing[3],
    tintColor: colors.textInverse,
  },

  navButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },

  navButtonArrow: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: '300',
  },

  // Alternative button styles for requests and settings - CENTERED
  requestsbutton: {
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
    borderRadius: 15,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },

  // New WarriorBook button style
  warriorbookbutton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)', // Purple theme
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 15,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },

  settingsbutton: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
    borderRadius: 15,
    borderWidth: 2,
    width: 280,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  // Status indicators
  statusIndicator: {
    position: 'absolute',
    top: spacing[12],
    right: spacing[6],
    backgroundColor: colors.success500,
    borderRadius: 50,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.base,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textInverse,
    marginRight: spacing[2],
  },

  statusText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },

  // Quick stats section (if needed)
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: spacing[4],
    borderRadius: 12,
    marginBottom: spacing[6],
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    color: colors.textInverse,
    fontSize: 24,
    fontWeight: 'bold',
  },

  statLabel: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing[1],
  },

  // Floating action elements
  floatingElements: {
    position: 'absolute',
    bottom: spacing[20],
    right: spacing[6],
  },

  quickActionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary500,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
    ...shadows.lg,
  },

  quickActionIcon: {
    color: colors.textInverse,
    fontSize: 20,
  },
});