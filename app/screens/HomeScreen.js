// app/screens/HomeScreen.js - Updated with Bigger, More Centered SOS Button
import React, { useEffect, useMemo, useCallback } from "react";
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import logoimage from "../../assets/logo.png";
import { useTheme } from "../context/ThemeContext";

// Memoized navigation button component
const NavigationButton = React.memo(({ 
  onPress, 
  style, 
  textStyle, 
  children, 
  accessibilityLabel,
  testID 
}) => (
  <TouchableOpacity
    style={style}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    testID={testID}
  >
    <Text style={textStyle}>{children}</Text>
  </TouchableOpacity>
));

NavigationButton.displayName = 'NavigationButton';

// Memoized SOS button component
const SOSButton = React.memo(({ onPress, styles }) => (
  <View style={styles.sosButtonContainer}>
    <TouchableOpacity
      style={styles.sosButton}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS Button"
      testID="sos-button"
    >
      <View style={styles.sosButtonInner}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </View>
    </TouchableOpacity>
  </View>
));

SOSButton.displayName = 'SOSButton';

const HomeScreen = React.memo(({ navigation }) => {
  const {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark,
  } = useTheme();

  // Memoized navigation handlers to prevent recreation on every render
  const handleSOSPress = useCallback(() => {
    console.log("SOS");
    navigation.navigate("Sos");
  }, [navigation]);

  const handleRequestsPress = useCallback(() => {
    console.log("REQUESTS");
    navigation.navigate("Requests");
  }, [navigation]);

  const handleSettingsPress = useCallback(() => {
    console.log("SETTINGS");
    navigation.navigate("Settings");
  }, [navigation]);

  const handleWarriorBookPress = useCallback(() => {
    console.log("WARRIOR BOOK");
    navigation.navigate("WarriorBook");
  }, [navigation]);

  const runOnboarding = useCallback(async () => {
    console.log("ONBOARDING");
    // Add your existing readOnboarded logic here if needed
  }, []);

  useEffect(() => {
    runOnboarding();
  }, [runOnboarding]);

  // Memoized styles to prevent recreation on every render
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
      paddingTop: StatusBar.currentHeight || 0,
    },

    logoContainer: {
      flex: 0.6, // Reduced from 0.8 to make more room for SOS button
      justifyContent: "center",
      alignItems: "center",
      paddingTop: spacing[4],
      paddingBottom: spacing[2],
    },

    logoimage: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      resizeMode: "center",
    },

    mainContent: {
      flex: 1,
      justifyContent: "center", // Changed from "space-between" to center content
      alignItems: "center",
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[6],
    },

    // Bigger, More Centered SOS Button
    sosButtonContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: spacing[8], // Increased margin for better centering
      position: "relative",
      flex: 1, // Take up more space to center better
    },

    sosButton: {
      width: 260, // Increased from 200
      height: 260, // Increased from 200
      borderRadius: 130, // Half of width/height for perfect circle
      backgroundColor: colors.emergency[500], // Always red
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.emergency[500],
      shadowOffset: { width: 0, height: 8 }, // Increased shadow offset
      shadowOpacity: 0.6, // Increased shadow opacity
      shadowRadius: 20, // Increased shadow radius
      elevation: 20, // Increased elevation for Android
      borderWidth: 4, // Increased border width
      borderColor: colors.emergency[400],
      // Additional glow effect
      transform: [{ scale: 1 }], // Base scale for animation
    },

    sosButtonInner: {
      width: 235, // Increased from 180, maintaining proportion
      height: 235, // Increased from 180, maintaining proportion
      borderRadius: 117.5, // Half of width/height
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3, // Increased border width
      borderColor: "rgba(255, 255, 255, 0.4)",
    },

    sosButtonText: {
      color: "#ffffff", // Always white text
      fontSize: 52, // Increased from 42
      fontWeight: typography.fontWeights.black,
      textShadowColor: "rgba(0, 0, 0, 0.5)",
      textShadowOffset: { width: 0, height: 3 }, // Increased shadow offset
      textShadowRadius: 6, // Increased shadow radius
      letterSpacing: 3, // Increased letter spacing
      textAlign: "center",
    },

    // Navigation Section - Moved to bottom
    navigationSection: {
      width: "100%",
      alignItems: "center",
      gap: spacing[3],
      paddingBottom: spacing[4],
      paddingTop: spacing[4], // Added top padding
    },

    // Base navigation button (adapts to theme)
    navButton: {
      width: "90%",
      maxWidth: 320,
      height: 56,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      ...shadows.base,
    },

    // Prayer Requests Button (Blue theme) - Better contrast
    requestsButton: {
      backgroundColor: isDark
        ? `${colors.primary[500]}30`
        : `${colors.primary[100]}`, // Lighter background for light theme
      borderColor: isDark
        ? `${colors.primary[500]}60`
        : `${colors.primary[400]}`, // Stronger border for light theme
    },

    // Warrior Book Button (Purple theme) - Better contrast
    warriorBookButton: {
      backgroundColor: isDark
        ? `${colors.warrior[500]}30`
        : `${colors.warrior[100]}`, // Lighter background for light theme
      borderColor: isDark
        ? `${colors.warrior[500]}60`
        : `${colors.warrior[400]}`, // Stronger border for light theme
    },

    // Settings Button (Gray theme) - Better contrast
    settingsButton: {
      backgroundColor: isDark
        ? `${colors.neutral[500]}30`
        : `${colors.neutral[200]}`, // Lighter background for light theme
      borderColor: isDark
        ? `${colors.neutral[500]}60`
        : `${colors.neutral[400]}`, // Stronger border for light theme
    },

    // Button text (better contrast for both themes)
    buttonText: {
      color: colors.text.primary, // Adapts to theme
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wide,
      textAlign: "center",
      textShadowColor: isDark ? "rgba(0, 0, 0, 0.3)" : "transparent", // Only shadow in dark theme
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  }), [colors, typography, spacing, borderRadius, shadows, isDark]);

  // Memoized button styles to prevent recreation
  const buttonStyles = useMemo(() => ({
    requests: [styles.navButton, styles.requestsButton],
    warriorBook: [styles.navButton, styles.warriorBookButton],
    settings: [styles.navButton, styles.settingsButton],
  }), [styles]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.dark}
      />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <ImageBackground
          source={logoimage}
          resizeMode="center"
          style={styles.logoimage}
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Big Red SOS Button - Now bigger and more centered */}
        <SOSButton onPress={handleSOSPress} styles={styles} />

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          {/* Prayer Requests Button */}
          <NavigationButton
            style={buttonStyles.requests}
            textStyle={styles.buttonText}
            onPress={handleRequestsPress}
            accessibilityLabel="Navigate to Prayer Requests"
            testID="requests-button"
          >
            PRAYER REQUESTS
          </NavigationButton>

          {/* Warrior Book Button */}
          <NavigationButton
            style={buttonStyles.warriorBook}
            textStyle={styles.buttonText}
            onPress={handleWarriorBookPress}
            accessibilityLabel="Navigate to Warrior Book"
            testID="warrior-book-button"
          >
            WARRIOR BOOK
          </NavigationButton>

          {/* Settings Button */}
          <NavigationButton
            style={buttonStyles.settings}
            textStyle={styles.buttonText}
            onPress={handleSettingsPress}
            accessibilityLabel="Navigate to Settings"
            testID="settings-button"
          >
            SETTINGS
          </NavigationButton>
        </View>
      </View>
    </SafeAreaView>
  );
});

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;