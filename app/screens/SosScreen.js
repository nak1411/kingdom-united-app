// app/screens/SosScreen.js - Updated with Content Filter Integration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import {
  prayerAPI,
  validation,
  errorHandler,
  debugConnection,
} from "../config/api.js";
import { userUtils } from "../utils/user.js";

export default function SosScreen({ navigation }) {
  const { colors, typography, spacing, borderRadius, shadows, isDark } =
    useTheme();

  const [prayer, setPrayer] = useState("");
  const [savedPrayer, setSavedPrayer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [userZip, setUserZip] = useState("");
  const [prayerError, setPrayerError] = useState("");
  const [prayerSuggestions, setPrayerSuggestions] = useState([]);
  const [userId, setUserId] = useState("");
  const [contentWarning, setContentWarning] = useState(""); // For real-time feedback

  const MAX_CHARACTERS = 125;
  const MIN_CHARACTERS = 5;

  // Store prayer in AsyncStorage
  const storePrayer = async (value) => {
    try {
      await AsyncStorage.setItem("prayer", value);
      setSavedPrayer(value);
    } catch (error) {
      console.error("Failed to store prayer:", error);
    }
  };

  // Read saved prayer from AsyncStorage
  const readPrayer = async () => {
    try {
      const savedPrayerText = await AsyncStorage.getItem("prayer");
      if (savedPrayerText) {
        setPrayer(savedPrayerText);
        setSavedPrayer(savedPrayerText);
        setCharacterCount(savedPrayerText.length);
      }
    } catch (error) {
      console.error("Failed to read prayer:", error);
    }
  };

  // Read user's data using utility function
  const readUserData = async () => {
    try {
      const userData = await userUtils.getUserData();
      setUserZip(userData.zip || "");
      setUserId(userData.userId);

      if (!userData.zip) {
        console.warn("User has not set zip code yet");
      }
    } catch (error) {
      console.error("Failed to read user data:", error);
      setUserId(`temp_${Date.now()}`);
    }
  };

  // Handle prayer text change with enhanced validation
  const handlePrayerChange = useCallback(
    (text) => {
      if (text.length <= MAX_CHARACTERS) {
        setPrayer(text);
        setCharacterCount(text.length);
        storePrayer(text);

        // Clear previous errors and suggestions
        if (prayerError) {
          setPrayerError("");
          setPrayerSuggestions([]);
        }

        // Real-time content validation (quick check)
        if (text.trim().length > 3) {
          try {
            const quickResult = validation.quickValidatePrayerText(text);
            if (
              quickResult &&
              typeof quickResult.isValid === "boolean" &&
              !quickResult.isValid
            ) {
              setContentWarning(
                quickResult.error || "Please review your content"
              );
            } else {
              setContentWarning("");
            }
          } catch (error) {
            console.error("Quick validation error:", error);
            setContentWarning("");
          }
        } else {
          setContentWarning("");
        }
      }
    },
    [prayerError]
  );

  // Enhanced prayer validation with content filtering
  const validatePrayer = useCallback((text) => {
    // Ensure we have a string to work with
    const textToValidate = String(text || "").trim();

    const result = validation.validatePrayerText(
      textToValidate,
      MIN_CHARACTERS,
      MAX_CHARACTERS
    );

    // Ensure proper return types
    return {
      error: result.isValid ? null : result.error || "Invalid prayer request",
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
    };
  }, []);

  // Submit prayer request to API
  const submitPrayerRequest = async (prayerText, zipCode, userId) => {
    try {
      if (!validation.validateUserId(userId)) {
        throw new Error("Invalid user ID");
      }

      if (!validation.validateZipCode(zipCode)) {
        throw new Error("Invalid zip code");
      }

      // Enhanced validation with content filtering
      const prayerValidation = validation.validatePrayerText(
        prayerText,
        MIN_CHARACTERS,
        MAX_CHARACTERS
      );

      if (!prayerValidation.isValid) {
        const error = new Error(
          prayerValidation.error || "Invalid prayer request"
        );
        if (
          prayerValidation.suggestions &&
          Array.isArray(prayerValidation.suggestions)
        ) {
          error.suggestions = prayerValidation.suggestions;
        }
        if (prayerValidation.hasInappropriateContent === true) {
          error.hasInappropriateContent = true;
        }
        throw error;
      }

      const result = await prayerAPI.submit({
        userId: userId,
        zip: parseInt(zipCode),
        prayerText: prayerText.trim(),
      });

      return {
        success: true,
        message: "Prayer request sent successfully",
        data: result,
      };
    } catch (error) {
      console.error("Prayer submission failed:", error);

      // If it's a content filter error, preserve the suggestions
      if (error.suggestions) {
        const filterError = new Error(error.message);
        filterError.suggestions = error.suggestions;
        filterError.hasInappropriateContent = error.hasInappropriateContent;
        throw filterError;
      }

      throw new Error(errorHandler.getErrorMessage(error));
    }
  };

  // Handle send button press with enhanced error handling
  const handleSendPressed = async () => {
    Keyboard.dismiss();

    const validationResult = validatePrayer(prayer);
    if (validationResult.error) {
      setPrayerError(validationResult.error);
      setPrayerSuggestions(validationResult.suggestions);
      return;
    }

    if (!userZip) {
      Alert.alert(
        "Setup Required",
        "Please set your zip code in Settings before sending a prayer request.",
        [
          { text: "Cancel" },
          {
            text: "Go to Settings",
            onPress: () => navigation.navigate("Settings"),
          },
        ]
      );
      return;
    }

    setIsSending(true);
    setPrayerError("");
    setPrayerSuggestions([]);

    try {
      console.log("=== DEBUGGING CONNECTION BEFORE PRAYER SUBMISSION ===");
      const debugResult = await debugConnection();
      console.log("Debug result:", debugResult);

      if (!debugResult.success) {
        throw new Error(`Connection test failed: ${debugResult.error}`);
      }

      const result = await submitPrayerRequest(prayer.trim(), userZip, userId);

      if (result.success) {
        setPrayer("");
        setSavedPrayer("");
        setCharacterCount(0);
        setContentWarning("");
        await AsyncStorage.removeItem("prayer");

        Alert.alert(
          "Prayer Sent! 🙏",
          "Your prayer request has been sent to your local prayer community. You'll receive support soon.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Home"),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Failed to send prayer:", error);

      // Handle content filter errors specially
      if (
        error.hasInappropriateContent === true &&
        error.suggestions &&
        Array.isArray(error.suggestions)
      ) {
        setPrayerError(error.message || "Please review your prayer request");
        setPrayerSuggestions(error.suggestions);

        // Show a gentle alert for content issues
        Alert.alert(
          "Content Review Needed",
          "Please review your prayer request and make sure it follows our community guidelines. Check the suggestions below for guidance.",
          [{ text: "OK" }]
        );
        return;
      }

      let errorMessage = errorHandler.getErrorMessage(error);
      let alertButtons = [{ text: "OK" }];

      if (errorHandler.isNetworkError(error)) {
        errorMessage +=
          "\n\nTroubleshooting steps:\n• Check if your server is running\n• Verify your device/emulator network connection\n• Try the debug connection test";
        alertButtons = [
          { text: "OK" },
          {
            text: "Debug Connection",
            onPress: async () => {
              const debugResult = await debugConnection();
              Alert.alert(
                "Debug Results",
                JSON.stringify(debugResult, null, 2)
              );
            },
          },
          { text: "Retry", onPress: handleSendPressed },
        ];
      } else {
        alertButtons.push({ text: "Retry", onPress: handleSendPressed });
      }

      Alert.alert("Send Failed", errorMessage, alertButtons);
    } finally {
      setIsSending(false);
    }
  };

  // Handle back button press
  const handleBackPressed = () => {
    if (prayer !== savedPrayer) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes to your prayer. Do you want to save before going back?",
        [
          {
            text: "Don't Save",
            style: "destructive",
            onPress: () => {
              setPrayer(savedPrayer);
              navigation.navigate("Home");
            },
          },
          {
            text: "Save",
            onPress: async () => {
              await storePrayer(prayer);
              navigation.navigate("Home");
            },
          },
        ]
      );
    } else {
      navigation.navigate("Home");
    }
  };

  // Clear prayer text
  const handleClearPressed = () => {
    Alert.alert(
      "Clear Prayer",
      "Are you sure you want to clear your prayer text?",
      [
        { text: "Cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setPrayer("");
            setCharacterCount(0);
            setPrayerError("");
            setPrayerSuggestions([]);
            setContentWarning("");
            storePrayer("");
          },
        },
      ]
    );
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([readPrayer(), readUserData()]).finally(() =>
      setIsLoading(false)
    );
  }, []);

  // Dynamic styles based on current theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
      paddingTop: StatusBar.currentHeight || 0,
    },

    scrollView: {
      flex: 1,
    },

    scrollContent: {
      padding: spacing[6],
      paddingBottom: spacing[4],
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background.dark,
    },

    loadingText: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.medium,
      marginTop: spacing[4],
    },

    header: {
      alignItems: "center",
      marginBottom: spacing[10],
      paddingTop: spacing[6],
    },

    title: {
      color: colors.text.primary,
      fontSize: typography.fontSizes["4xl"],
      fontWeight: typography.fontWeights.bold,
      textAlign: "center",
      marginBottom: spacing[3],
      textShadowColor: isDark ? "rgba(0, 0, 0, 0.5)" : "transparent",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },

    subtitle: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.lg,
      textAlign: "center",
      lineHeight: typography.lineHeights.relaxed,
      paddingHorizontal: spacing[4],
      fontWeight: typography.fontWeights.medium,
    },

    zipInfo: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.base,
      textAlign: "center",
      marginTop: spacing[2],
      fontStyle: "italic",
      opacity: 0.9,
    },

    inputSection: {
      marginBottom: spacing[6],
    },

    inputCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.xl,
      padding: spacing[6],
      ...shadows.lg,
      borderWidth: 1,
      borderColor: colors.border.light,
    },

    inputHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[4],
    },

    inputLabel: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
    },

    characterCount: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
    },

    characterCountWarning: {
      color: colors.emergency[500],
    },

    input: {
      backgroundColor: colors.background.secondary,
      borderWidth: 2,
      borderColor: colors.border.light,
      borderRadius: borderRadius.md,
      padding: spacing[4],
      fontSize: typography.fontSizes.base,
      lineHeight: typography.lineHeights.normal,
      minHeight: 160,
      textAlignVertical: "top",
      color: colors.text.primary,
      ...shadows.sm,
    },

    inputFocused: {
      borderColor: colors.primary[500],
      backgroundColor: colors.background.primary,
      ...shadows.base,
    },

    inputError: {
      borderColor: colors.emergency[500],
      backgroundColor: isDark
        ? `${colors.emergency[500]}20`
        : colors.emergency[50],
    },

    inputWarning: {
      borderColor: colors.warning[500],
      backgroundColor: isDark ? `${colors.warning[500]}20` : colors.warning[50],
    },

    // Error and warning text styles
    errorText: {
      color: colors.emergency[600],
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      marginTop: spacing[2],
      marginLeft: spacing[1],
    },

    warningText: {
      color: colors.warning[600],
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      marginTop: spacing[2],
      marginLeft: spacing[1],
    },

    helperText: {
      color: colors.success[600],
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      marginTop: spacing[2],
      marginLeft: spacing[1],
    },

    // Suggestions section
    suggestionsSection: {
      backgroundColor: isDark ? `${colors.primary[500]}20` : colors.primary[50],
      borderRadius: borderRadius.md,
      padding: spacing[4],
      marginTop: spacing[3],
      borderLeftWidth: 4,
      borderLeftColor: colors.primary[500],
    },

    suggestionsTitle: {
      color: colors.primary[700],
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.semibold,
      marginBottom: spacing[2],
    },

    suggestionItem: {
      color: colors.primary[600],
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.normal,
      marginBottom: spacing[1],
    },

    guidelinesSection: {
      backgroundColor: colors.background.glassMedium,
      borderRadius: borderRadius.md,
      padding: spacing[5],
      marginBottom: spacing[6],
      borderWidth: 1,
      borderColor: colors.border.light,
    },

    guidelinesTitle: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      marginBottom: spacing[3],
    },

    guidelinesText: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.base,
      lineHeight: typography.lineHeights.normal,
    },

    buttonSection: {
      padding: spacing[6],
      paddingTop: spacing[4],
      gap: spacing[4],
    },

    clearButton: {
      backgroundColor: colors.background.glassMedium,
      borderWidth: 1,
      borderColor: colors.border.light,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.md,
      alignItems: "center",
      ...shadows.base,
    },

    clearButtonText: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wide,
    },

    sendButton: {
      backgroundColor: colors.emergency[500],
      paddingVertical: spacing[6],
      paddingHorizontal: spacing[8],
      borderRadius: borderRadius.lg,
      alignItems: "center",
      ...shadows.xl,
      shadowColor: colors.emergency[500],
      shadowOpacity: 0.4,
    },

    sendButtonDisabled: {
      backgroundColor: colors.neutral[400],
      ...shadows.sm,
    },

    sendingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    sendingText: {
      color: "#ffffff",
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      marginLeft: spacing[3],
      letterSpacing: typography.letterSpacing.wide,
    },

    sendButtonText: {
      color: "#ffffff",
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      letterSpacing: typography.letterSpacing.wide,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },

    sendButtonTextDisabled: {
      color: colors.text.disabled,
    },

    backButton: {
      backgroundColor: colors.background.glassMedium,
      borderWidth: 1,
      borderColor: colors.border.light,
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.md,
      alignItems: "center",
    },

    backButtonText: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wide,
    },

    emergencyIndicator: {
      position: "absolute",
      top: spacing[4],
      right: spacing[4],
      backgroundColor: colors.emergency[500],
      borderRadius: borderRadius.full,
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[3],
      flexDirection: "row",
      alignItems: "center",
      ...shadows.base,
    },

    emergencyDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#ffffff",
      marginRight: spacing[2],
    },

    emergencyText: {
      color: "#ffffff",
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.bold,
    },

    tipsSection: {
      backgroundColor: isDark
        ? `${colors.primary[500]}20`
        : `${colors.primary[100]}`,
      borderRadius: borderRadius.md,
      padding: spacing[5],
      marginBottom: spacing[6],
      borderLeftWidth: 4,
      borderLeftColor: colors.primary[500],
    },

    tipsTitle: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.semibold,
      marginBottom: spacing[2],
    },

    tipsText: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.normal,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background.dark}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Emergency Prayer Request</Text>
            <Text style={styles.subtitle}>
              Share your prayer request with your local community
            </Text>
            {userZip && (
              <Text style={styles.zipInfo}>
                Sending to community in {userZip}
              </Text>
            )}
          </View>

          {/* Prayer Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>Your Prayer Request</Text>
                <Text
                  style={[
                    styles.characterCount,
                    Boolean(characterCount > MAX_CHARACTERS * 0.9) &&
                      styles.characterCountWarning,
                  ]}
                >
                  {characterCount}/{MAX_CHARACTERS}
                </Text>
              </View>

              <TextInput
                value={prayer}
                onChangeText={handlePrayerChange}
                multiline={true}
                numberOfLines={6}
                maxLength={MAX_CHARACTERS}
                style={[
                  styles.input,
                  Boolean(prayerError) ? styles.inputError : null,
                  Boolean(contentWarning && !prayerError)
                    ? styles.inputWarning
                    : null,
                ]}
                placeholder="Please share what you need prayer for. Be as specific as you'd like - your community is here to support you."
                placeholderTextColor={colors.text.placeholder}
                textAlignVertical="top"
                editable={Boolean(!isSending)}
                accessibilityLabel="Prayer request input"
                accessibilityHint="Enter your prayer request text"
              />

              {/* Error Messages */}
              {Boolean(prayerError) && (
                <Text style={styles.errorText}>{prayerError}</Text>
              )}

              {/* Content Warning (real-time) */}
              {Boolean(contentWarning && !prayerError) && (
                <Text style={styles.warningText}>{contentWarning}</Text>
              )}

              {/* Success Message */}
              {Boolean(
                characterCount >= MIN_CHARACTERS &&
                  !prayerError &&
                  !contentWarning
              ) && <Text style={styles.helperText}>Ready to send</Text>}

              {/* Content Suggestions */}
              {Boolean(prayerSuggestions.length > 0) && (
                <View style={styles.suggestionsSection}>
                  <Text style={styles.suggestionsTitle}>Suggestions:</Text>
                  {prayerSuggestions.map((suggestion, index) => (
                    <Text key={index} style={styles.suggestionItem}>
                      • {suggestion}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Prayer Guidelines */}
          <View style={styles.guidelinesSection}>
            <Text style={styles.guidelinesTitle}>
              Prayer Request Guidelines:
            </Text>
            <Text style={styles.guidelinesText}>
              Be respectful and honest{"\n"}Share what kind of support you need
              {"\n"}Include any urgent timing if applicable{"\n"}Your request
              will be shared anonymously{"\n"}Keep language appropriate for all
              community members
            </Text>
          </View>
        </ScrollView>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          {Boolean(prayer.trim().length > 0) && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearPressed}
              disabled={Boolean(isSending)}
              accessibilityRole="button"
              accessibilityLabel="Clear prayer text"
            >
              <Text style={styles.clearButtonText}>CLEAR</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.sendButton,
              (Boolean(!prayer.trim()) ||
                Boolean(prayer.trim().length < MIN_CHARACTERS) ||
                Boolean(isSending) ||
                Boolean(prayerError) ||
                Boolean(contentWarning)) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSendPressed}
            disabled={
              Boolean(!prayer.trim()) ||
              Boolean(prayer.trim().length < MIN_CHARACTERS) ||
              Boolean(isSending) ||
              Boolean(prayerError) ||
              Boolean(contentWarning)
            }
            accessibilityRole="button"
            accessibilityLabel="Send prayer request"
          >
            {isSending ? (
              <View style={styles.sendingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.sendingText}>SENDING...</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.sendButtonText,
                  (Boolean(!prayer.trim()) ||
                    Boolean(prayer.trim().length < MIN_CHARACTERS) ||
                    Boolean(prayerError) ||
                    Boolean(contentWarning)) &&
                    styles.sendButtonTextDisabled,
                ]}
              >
                SEND PRAYER REQUEST
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPressed}
            disabled={Boolean(isSending)}
            accessibilityRole="button"
            accessibilityLabel="Go back to home"
          >
            <Text style={styles.backButtonText}>BACK TO HOME</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
