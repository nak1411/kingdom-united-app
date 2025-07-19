import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import backgroundimage from "../../assets/image_33.jpg";
import {
  prayerAPI,
  validation,
  errorHandler,
  debugConnection,
} from "../config/api.js";
import { userUtils } from "../utils/user.js";

export default function SosScreen({ navigation }) {
  const [prayer, setPrayer] = useState("");
  const [savedPrayer, setSavedPrayer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [userZip, setUserZip] = useState("");
  const [prayerError, setPrayerError] = useState("");
  const [userId, setUserId] = useState("");

  const MAX_CHARACTERS = 500; // Increased from 120 for more detailed prayers
  const MIN_CHARACTERS = 10;

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
      // Set fallback values
      setUserId(`temp_${Date.now()}`);
    }
  };

  // Handle prayer text change
  const handlePrayerChange = useCallback(
    (text) => {
      if (text.length <= MAX_CHARACTERS) {
        setPrayer(text);
        setCharacterCount(text.length);
        storePrayer(text);

        // Clear error when user starts typing
        if (prayerError) {
          setPrayerError("");
        }
      }
    },
    [prayerError]
  );

  // Validate prayer text using utility function
  const validatePrayer = useCallback((text) => {
    const result = validation.validatePrayerText(
      text,
      MIN_CHARACTERS,
      MAX_CHARACTERS
    );

    if (!text.trim()) {
      return "Please enter your prayer request";
    }

    if (!result.isValid) {
      if (result.length < result.minLength) {
        return `Prayer request must be at least ${result.minLength} characters`;
      }
      if (result.length > result.maxLength) {
        return `Prayer request must be no more than ${result.maxLength} characters`;
      }
    }

    return null;
  }, []);

  // Submit prayer request to API using the prayerAPI utility
  const submitPrayerRequest = async (prayerText, zipCode, userId) => {
    try {
      // Validate inputs
      if (!validation.validateUserId(userId)) {
        throw new Error("Invalid user ID");
      }

      if (!validation.validateZipCode(zipCode)) {
        throw new Error("Invalid zip code");
      }

      const prayerValidation = validation.validatePrayerText(
        prayerText,
        MIN_CHARACTERS,
        MAX_CHARACTERS
      );
      if (!prayerValidation.isValid) {
        throw new Error("Invalid prayer text length");
      }

      // Submit to API
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
      throw new Error(errorHandler.getErrorMessage(error));
    }
  };

  // Handle send button press with connection testing
  const handleSendPressed = async () => {
    Keyboard.dismiss();

    const validationError = validatePrayer(prayer);
    if (validationError) {
      setPrayerError(validationError);
      return;
    }

    // Check if user has zip code
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

    try {
      // First, debug the connection
      console.log("=== DEBUGGING CONNECTION BEFORE PRAYER SUBMISSION ===");
      const debugResult = await debugConnection();
      console.log("Debug result:", debugResult);

      if (!debugResult.success) {
        throw new Error(`Connection test failed: ${debugResult.error}`);
      }

      // Submit prayer request to API
      const result = await submitPrayerRequest(prayer.trim(), userZip, userId);

      if (result.success) {
        // Clear prayer after successful submission
        setPrayer("");
        setSavedPrayer("");
        setCharacterCount(0);

        // Clear from storage
        await AsyncStorage.removeItem("prayer");

        // Show success message
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

      let errorMessage = errorHandler.getErrorMessage(error);
      let alertButtons = [{ text: "OK" }];

      // Add debug option for network errors
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
            storePrayer("");
            setPrayerError("");
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={backgroundimage}
          resizeMode="stretch"
          style={styles.backgroundimage}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Emergency Prayer Request 🙏</Text>
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
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Your Prayer Request</Text>
              <Text
                style={[
                  styles.characterCount,
                  characterCount > MAX_CHARACTERS * 0.9 &&
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
              style={[styles.input, prayerError ? styles.inputError : null]}
              placeholder="Please share what you need prayer for. Be as specific as you'd like - your community is here to support you."
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              textAlignVertical="top"
              editable={!isSending}
              accessibilityLabel="Prayer request input"
              accessibilityHint="Enter your prayer request text"
            />

            {prayerError && <Text style={styles.errorText}>{prayerError}</Text>}

            {characterCount >= MIN_CHARACTERS && !prayerError && (
              <Text style={styles.helperText}>✓ Ready to send</Text>
            )}
          </View>

          {/* Prayer Guidelines */}
          <View style={styles.guidelinesSection}>
            <Text style={styles.guidelinesTitle}>
              Prayer Request Guidelines:
            </Text>
            <Text style={styles.guidelinesText}>
              • Be respectful and honest{"\n"}• Share what kind of support you
              need{"\n"}• Include any urgent timing if applicable{"\n"}• Your
              request will be shared anonymously
            </Text>
          </View>
        </ScrollView>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          {prayer.trim().length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearPressed}
              disabled={isSending}
              accessibilityRole="button"
              accessibilityLabel="Clear prayer text"
            >
              <Text style={styles.clearButtonText}>CLEAR</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!prayer.trim() ||
                prayer.trim().length < MIN_CHARACTERS ||
                isSending) &&
                styles.buttonDisabled,
            ]}
            onPress={handleSendPressed}
            disabled={
              !prayer.trim() ||
              prayer.trim().length < MIN_CHARACTERS ||
              isSending
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
                  (!prayer.trim() || prayer.trim().length < MIN_CHARACTERS) &&
                    styles.buttonTextDisabled,
                ]}
              >
                SEND PRAYER REQUEST
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPressed}
            disabled={isSending}
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

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#3e3e3e",
    paddingTop: StatusBar.currentHeight || 0,
  },
  backgroundimage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  zipInfo: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
  },
  inputSection: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inputLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  characterCount: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  characterCountWarning: {
    color: "#ffaa00",
  },
  input: {
    backgroundColor: "white",
    fontSize: 16,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputError: {
    borderColor: "#ff4444",
    backgroundColor: "#ffe6e6",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  helperText: {
    color: "#4CAF50",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  guidelinesSection: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  guidelinesTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  guidelinesText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    lineHeight: 20,
  },
  buttonSection: {
    padding: 20,
    paddingTop: 10,
  },
  clearButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sendButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  sendingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sendingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  buttonTextDisabled: {
    color: "#999999",
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  backButtonText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "600",
  },
};
