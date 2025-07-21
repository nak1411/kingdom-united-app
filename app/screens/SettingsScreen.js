// app/screens/SettingsScreen.js - Updated with Theme Toggle
import { StatusBar, Alert, Keyboard, BackHandler, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { userUtils } from "../utils/user.js";
import { validation } from "../config/api.js";

export default function SettingsScreen({ navigation }) {
  const {
    currentTheme,
    isDark,
    toggleTheme,
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    commonStyles,
  } = useTheme();

  const [currentZip, setCurrentZip] = useState("");
  const [newZip, setNewZip] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [zipError, setZipError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [userData, setUserData] = useState(null);

  // Load current user data
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const data = await userUtils.getUserData();
      setUserData(data);
      setCurrentZip(data.zip || "");
      setNewZip(data.zip || "");
      console.log("Loaded user data:", data);
    } catch (error) {
      console.error("Failed to load user data:", error);
      Alert.alert("Error", "Failed to load your settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate zip code format
  const validateZip = useCallback((zipCode) => {
    return validation.validateZipCode(zipCode);
  }, []);

  // Handle zip code input change
  const handleZipChange = useCallback(
    (value) => {
      const numericValue = value.replace(/[^0-9]/g, "");
      setNewZip(numericValue);

      if (zipError) {
        setZipError("");
      }

      setHasUnsavedChanges(numericValue !== currentZip);
    },
    [zipError, currentZip]
  );

  // Save zip code changes
  const handleSaveZip = async () => {
    Keyboard.dismiss();

    if (!newZip.trim()) {
      setZipError("Please enter your zip code");
      return;
    }

    if (!validateZip(newZip)) {
      setZipError("Please enter a valid 5-digit zip code");
      return;
    }

    if (newZip === currentZip) {
      setZipError("This is already your current zip code");
      return;
    }

    setIsSaving(true);

    try {
      await userUtils.updateUserData({ zip: newZip });
      setCurrentZip(newZip);
      setHasUnsavedChanges(false);

      Alert.alert(
        "Zip Code Updated! 📍",
        `Your location has been updated to ${newZip}. You'll now see prayer requests from your new area.`,
        [{ text: "OK" }]
      );

      console.log("Zip code updated to:", newZip);
    } catch (error) {
      console.error("Failed to update zip code:", error);
      Alert.alert(
        "Update Failed",
        "There was an error updating your zip code. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel zip code changes
  const handleCancelZipChange = () => {
    setNewZip(currentZip);
    setHasUnsavedChanges(false);
    setZipError("");
    Keyboard.dismiss();
  };

  // Handle theme toggle
  const handleThemeToggle = async () => {
    try {
      await toggleTheme();
      // Optional: Show confirmation
      // Alert.alert(
      //   "Theme Changed",
      //   `Switched to ${isDark ? 'light' : 'dark'} mode`,
      //   [{ text: "OK" }]
      // );
    } catch (error) {
      console.error("Failed to toggle theme:", error);
      Alert.alert("Error", "Failed to change theme. Please try again.");
    }
  };

  // Clear all app data and restart onboarding
  const handleResetApp = async () => {
    Alert.alert(
      "Reset App Data",
      "This will clear all your data and restart the app setup process. Are you sure you want to continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset App",
          style: "destructive",
          onPress: confirmResetApp,
        },
      ]
    );
  };

  const confirmResetApp = async () => {
    setIsResetting(true);

    try {
      console.log("Resetting app data...");
      await userUtils.clearUserData();
      await AsyncStorage.multiRemove([
        "prayer",
        "lastUpdateTime",
        "userPreferences",
        "theme", // Also reset theme preference
      ]);

      console.log("App data cleared successfully");

      Alert.alert(
        "App Reset Complete",
        "The app data has been cleared. Please restart the app.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Failed to reset app:", error);
      Alert.alert(
        "Reset Failed",
        "There was an error resetting the app. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsResetting(false);
    }
  };

  // Handle back button with unsaved changes check
  const handleBackPressed = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes to your zip code. Do you want to save before going back?",
        [
          {
            text: "Don't Save",
            style: "destructive",
            onPress: () => {
              handleCancelZipChange();
              navigation.navigate("Home");
            },
          },
          {
            text: "Save",
            onPress: async () => {
              await handleSaveZip();
              if (!zipError) {
                navigation.navigate("Home");
              }
            },
          },
        ]
      );
    } else {
      navigation.navigate("Home");
    }
  };

  // Show app info
  const showAppInfo = () => {
    Alert.alert(
      "App Information",
      `Kingdom United App v1.0.0\n\nUser ID: ${
        userData?.userId || "Unknown"
      }\nCurrent Zip: ${currentZip || "Not set"}\nTheme: ${
        isDark ? "Dark" : "Light"
      }\nSetup Complete: ${userData?.isOnboarded ? "Yes" : "No"}`,
      [{ text: "OK" }]
    );
  };

  // Component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Create dynamic styles based on current theme
  const styles = StyleSheet.create({
    container: {
      ...commonStyles.container,
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
      marginBottom: spacing[12],
      paddingTop: spacing[6],
    },

    title: {
      color: colors.text.primary,
      fontWeight: typography.fontWeights.bold,
      fontSize: typography.fontSizes["5xl"],
      marginBottom: spacing[3],
      textShadowColor: colors.background.overlay,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },

    subtitle: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.lg,
      textAlign: "center",
      lineHeight: typography.lineHeights.relaxed,
      fontWeight: typography.fontWeights.medium,
    },

    section: {
      marginBottom: spacing[8],
    },

    sectionTitle: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.semibold,
      marginBottom: spacing[5],
      paddingHorizontal: spacing[2],
    },

    card: {
      ...commonStyles.card,
    },

    // Theme Toggle Section - Fixed for dark theme
    themeSection: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      marginBottom: spacing[5],
      ...shadows.lg,
      borderWidth: 1,
      borderColor: colors.border.light,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    themeInfo: {
      flex: 1,
    },

    themeTitle: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      marginBottom: spacing[1],
    },

    themeDescription: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.normal,
    },

    themeToggle: {
      marginLeft: spacing[4],
    },

    // Current location card - Fixed for dark theme
    currentLocationCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      marginBottom: spacing[5],
      ...shadows.lg,
      borderWidth: 1,
      borderColor: colors.border.light,
      alignItems: "center",
    },

    currentLocationLabel: {
      fontSize: typography.fontSizes.sm,
      color: colors.text.secondary,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wider,
      marginBottom: spacing[2],
      textAlign: "center",
    },

    currentLocationValue: {
      fontSize: typography.fontSizes["5xl"],
      fontWeight: typography.fontWeights.bold,
      color: colors.text.primary,
      marginBottom: spacing[3],
      letterSpacing: typography.letterSpacing.wide,
    },

    currentLocationNote: {
      fontSize: typography.fontSizes.sm,
      color: colors.text.secondary,
      textAlign: "center",
      fontStyle: "italic",
      lineHeight: typography.lineHeights.normal,
    },

    // Input section - Fixed for dark theme
    inputCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      marginBottom: spacing[5],
      ...shadows.lg,
      borderWidth: 1,
      borderColor: colors.border.light,
    },

    inputLabel: {
      fontSize: typography.fontSizes.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wider,
      marginBottom: spacing[4],
      textAlign: "center",
    },

    input: {
      ...commonStyles.input,
      fontSize: typography.fontSizes["3xl"],
      fontWeight: typography.fontWeights.bold,
      textAlign: "center",
      paddingVertical: spacing[5],
      paddingHorizontal: spacing[6],
      marginBottom: spacing[3],
      letterSpacing: typography.letterSpacing.wide,
    },

    inputError: {
      borderColor: colors.emergency[500],
      backgroundColor: colors.emergency[50],
    },

    inputChanged: {
      borderColor: colors.success[500],
      backgroundColor: colors.success[50],
    },

    // Helper text
    errorText: {
      color: colors.emergency[600],
      fontSize: typography.fontSizes.sm,
      textAlign: "center",
      marginTop: spacing[2],
      fontWeight: typography.fontWeights.medium,
    },

    helperText: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.sm,
      textAlign: "center",
      marginTop: spacing[2],
      fontWeight: typography.fontWeights.medium,
    },

    changedText: {
      color: colors.success[600],
      fontSize: typography.fontSizes.sm,
      textAlign: "center",
      marginTop: spacing[2],
      fontWeight: typography.fontWeights.semibold,
    },

    // Zip actions
    zipActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing[5],
      gap: spacing[3],
    },

    cancelButton: {
      flex: 1,
      ...commonStyles.button,
      backgroundColor: colors.neutral[500],
    },

    cancelButtonText: {
      ...commonStyles.buttonText,
    },

    saveButton: {
      flex: 1,
      ...commonStyles.button,
      backgroundColor: colors.primary[500],
    },

    saveButtonText: {
      ...commonStyles.buttonText,
    },

    buttonDisabled: {
      backgroundColor: colors.neutral[400],
      ...shadows.sm,
    },

    buttonTextDisabled: {
      color: colors.text.disabled,
    },

    // Action cards - Fixed for dark theme
    actionCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      marginBottom: spacing[4],
      ...shadows.md,
      borderWidth: 1,
      borderColor: colors.border.light,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    dangerCard: {
      borderLeftWidth: 4,
      borderLeftColor: colors.emergency[500],
    },

    actionContent: {
      flex: 1,
    },

    actionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.text.primary,
      marginBottom: spacing[1],
    },

    actionDescription: {
      fontSize: typography.fontSizes.sm,
      color: colors.text.secondary,
      lineHeight: typography.lineHeights.normal,
    },

    actionArrow: {
      fontSize: typography.fontSizes["2xl"],
      color: colors.text.secondary,
      marginLeft: spacing[4],
    },

    // Info section - Fixed for dark theme
    infoSection: {
      backgroundColor: isDark
        ? colors.background.glassDark
        : `${colors.primary[100]}`,
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      marginBottom: spacing[6],
      borderWidth: 1,
      borderColor: colors.border.light,
    },

    infoText: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.sm,
      textAlign: "center",
      lineHeight: typography.lineHeights.normal,
      fontWeight: typography.fontWeights.medium,
    },

    // Bottom section
    bottomSection: {
      padding: spacing[6],
      paddingTop: spacing[4],
    },

    backButton: {
      backgroundColor: colors.background.glassMedium,
      borderWidth: 1,
      borderColor: colors.border.light,
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.md,
      alignItems: "center",
      ...shadows.base,
    },

    backButtonText: {
      color: colors.text.primary,
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wide,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading settings...</Text>
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
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>
              Manage your location, theme, and app preferences
            </Text>
          </View>

          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.themeSection}>
              <View style={styles.themeInfo}>
                <Text style={styles.themeTitle}>
                  {isDark ? "Dark Mode" : "Light Mode"}
                </Text>
                <Text style={styles.themeDescription}>
                  {isDark
                    ? "Dark theme is easier on the eyes in low light"
                    : "Light theme provides better visibility in bright environments"}
                </Text>
              </View>
              <View style={styles.themeToggle}>
                <Switch
                  value={isDark}
                  onValueChange={handleThemeToggle}
                  trackColor={{
                    false: colors.neutral[300],
                    true: colors.primary[500],
                  }}
                  thumbColor={
                    isDark ? colors.primary[100] : colors.neutral[100]
                  }
                  ios_backgroundColor={colors.neutral[300]}
                />
              </View>
            </View>
          </View>

          {/* Current Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Location</Text>
            <View style={styles.currentLocationCard}>
              <Text style={styles.currentLocationLabel}>ZIP CODE</Text>
              <Text style={styles.currentLocationValue}>
                {currentZip || "Not set"}
              </Text>
              {currentZip && (
                <Text style={styles.currentLocationNote}>
                  You're seeing prayers from the {currentZip} area
                </Text>
              )}
            </View>
          </View>

          {/* Change Zip Code Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Update Location</Text>
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>NEW ZIP CODE</Text>
              <TextInput
                value={newZip}
                onChangeText={handleZipChange}
                maxLength={5}
                style={[
                  styles.input,
                  zipError ? styles.inputError : null,
                  hasUnsavedChanges ? styles.inputChanged : null,
                ]}
                placeholder="Enter 5-digit zip code"
                placeholderTextColor={colors.text.placeholder}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleSaveZip}
                editable={!isSaving}
              />

              {zipError ? (
                <Text style={styles.errorText}>{zipError}</Text>
              ) : null}

              {newZip.length > 0 && newZip.length < 5 ? (
                <Text style={styles.helperText}>
                  {5 - newZip.length} more digit
                  {5 - newZip.length !== 1 ? "s" : ""} needed
                </Text>
              ) : null}

              {hasUnsavedChanges && validateZip(newZip) ? (
                <Text style={styles.changedText}>
                  Ready to save new location
                </Text>
              ) : null}

              {/* Zip Code Action Buttons */}
              {hasUnsavedChanges && (
                <View style={styles.zipActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelZipChange}
                    disabled={isSaving}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      (!newZip || !validateZip(newZip) || isSaving) &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleSaveZip}
                    disabled={!newZip || !validateZip(newZip) || isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text
                        style={[
                          styles.saveButtonText,
                          (!newZip || !validateZip(newZip)) &&
                            styles.buttonTextDisabled,
                        ]}
                      >
                        Save Location
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* App Management Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Management</Text>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={showAppInfo}
              activeOpacity={0.7}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>App Information</Text>
                <Text style={styles.actionDescription}>
                  View app version, theme, and user details
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.dangerCard]}
              onPress={handleResetApp}
              disabled={isResetting}
              activeOpacity={0.7}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Reset App</Text>
                <Text style={styles.actionDescription}>
                  Clear all data and restart setup process
                </Text>
              </View>
              {isResetting ? (
                <ActivityIndicator color={colors.emergency[500]} size="small" />
              ) : (
                <Text style={styles.actionArrow}>›</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPressed}
            disabled={isSaving || isResetting}
          >
            <Text style={styles.backButtonText}>
              {hasUnsavedChanges ? "BACK (UNSAVED CHANGES)" : "BACK TO HOME"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
