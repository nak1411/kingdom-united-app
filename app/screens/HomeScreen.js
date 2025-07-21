// app/screens/HomeScreen.js - Theme-Aware Version
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useEffect } from "react";
import logoimage from "../../assets/logo.png";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen({ navigation }) {
  const {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark,
    commonStyles,
  } = useTheme();

  const runOnboarding = async () => {
    console.log("ONBOARDING");
    // Add your existing readOnboarded logic here if needed
  };

  const sosPressed = () => {
    console.log("SOS");
    navigation.navigate("Sos");
  };

  const requestsPressed = () => {
    console.log("REQUESTS");
    navigation.navigate("Requests");
  };

  const settingsPressed = () => {
    console.log("SETTINGS");
    navigation.navigate("Settings");
  };

  const warriorBookPressed = () => {
    console.log("WARRIOR BOOK");
    navigation.navigate("WarriorBook");
  };

  useEffect(() => {
    runOnboarding();
  }, []);

  // Dynamic styles based on current theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
      paddingTop: StatusBar.currentHeight || 0,
    },

    logoContainer: {
      flex: 0.8,
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
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[6],
    },

    // Big Red SOS Button (always red regardless of theme)
    sosButtonContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: spacing[6],
      position: "relative",
    },

    sosButton: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.emergency[500], // Always red
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.emergency[500],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 15,
      borderWidth: 3,
      borderColor: colors.emergency[400],
    },

    sosButtonInner: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 0.4)",
    },

    sosButtonText: {
      color: "#ffffff", // Always white text
      fontSize: 42,
      fontWeight: typography.fontWeights.black,
      textShadowColor: "rgba(0, 0, 0, 0.5)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      letterSpacing: 2,
      textAlign: "center",
    },

    sosButtonSubtext: {
      color: isDark ? colors.text.secondary : colors.text.primary, // Dark text in light theme
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.semibold,
      marginTop: spacing[1],
      textAlign: "center",
      position: "absolute",
      bottom: -spacing[6],
      textShadowColor: isDark ? colors.background.overlay : "transparent",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },

    // Navigation Section
    navigationSection: {
      width: "100%",
      alignItems: "center",
      gap: spacing[3],
      paddingBottom: spacing[4],
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
      color: isDark ? colors.text.primary : colors.text.primary, // Dark text in light theme
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wide,
      textAlign: "center",
      textShadowColor: isDark ? "rgba(0, 0, 0, 0.3)" : "transparent", // Only shadow in dark theme
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  });

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
        {/* Big Red SOS Button */}
        <View style={styles.sosButtonContainer}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={sosPressed}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Emergency SOS Button"
          >
            <View style={styles.sosButtonInner}>
              <Text style={styles.sosButtonText}>SOS</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          {/* Prayer Requests Button */}
          <TouchableOpacity
            style={[styles.navButton, styles.requestsButton]}
            onPress={requestsPressed}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>PRAYER REQUESTS</Text>
          </TouchableOpacity>

          {/* Warrior Book Button */}
          <TouchableOpacity
            style={[styles.navButton, styles.warriorBookButton]}
            onPress={warriorBookPressed}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>WARRIOR BOOK</Text>
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity
            style={[styles.navButton, styles.settingsButton]}
            onPress={settingsPressed}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
