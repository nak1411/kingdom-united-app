import { StatusBar, Alert, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";

import backgroundimage from "../../assets/image_33.jpg";

export default function OnboardingForm({ navigation }) {
  const [zip, setZip] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [zipError, setZipError] = useState("");

  // Validate zip code format
  const validateZip = useCallback((zipCode) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zipCode.trim());
  }, []);

  // Store onboarded status
  const storeOnboarded = async (value) => {
    try {
      await AsyncStorage.setItem("onboarded", value);
    } catch (error) {
      console.error('Failed to store onboarded status:', error);
      Alert.alert("Error", "Failed to save setup progress. Please try again.");
    }
  };

  // Store zip code with validation
  const storeZip = async (value) => {
    try {
      const trimmedValue = value.trim();
      await AsyncStorage.setItem("zip", trimmedValue);
      console.log('Zip code stored:', trimmedValue);
    } catch (error) {
      console.error('Failed to store zip:', error);
      throw new Error("Failed to save zip code");
    }
  };

  // Read existing zip code on component mount
  const readZip = async () => {
    try {
      const savedZip = await AsyncStorage.getItem("zip");
      if (savedZip) {
        setZip(savedZip);
      }
    } catch (error) {
      console.error('Failed to read zip:', error);
    }
  };

  // Handle zip code input change
  const handleZipChange = useCallback((value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setZip(numericValue);
    
    // Clear error when user starts typing
    if (zipError) {
      setZipError("");
    }
  }, [zipError]);

  // Handle finish button press
  const handleFinishPressed = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();
    
    // Validate zip code
    if (!zip.trim()) {
      setZipError("Please enter your zip code");
      return;
    }

    if (!validateZip(zip)) {
      setZipError("Please enter a valid 5-digit zip code");
      return;
    }

    setIsLoading(true);
    
    try {
      // Store zip code and onboarded status
      await storeZip(zip);
      await storeOnboarded("true");
      
      // Navigate to home screen
      navigation.replace("Home");
    } catch (error) {
      console.error('Setup failed:', error);
      Alert.alert(
        "Setup Failed", 
        "There was an error completing your setup. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Skip setup (for testing purposes - remove in production)
  const handleSkip = async () => {
    try {
      await storeOnboarded("true");
      navigation.replace("Home");
    } catch (error) {
      console.error('Skip failed:', error);
    }
  };

  useEffect(() => {
    readZip();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={backgroundimage}
          resizeMode="stretch"
          style={styles.backgroundimage}
        >
          <StatusBar style="light" />
          
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.subtitle}>
                Let's get you set up with your location
              </Text>
            </View>

            {/* Zip Code Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>ZIP CODE</Text>
              <TextInput
                value={zip}
                onChangeText={handleZipChange}
                maxLength={5}
                style={[
                  styles.input,
                  zipError ? styles.inputError : null
                ]}
                placeholder="Enter 5-digit zip code"
                placeholderTextColor="#999"
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleFinishPressed}
                editable={!isLoading}
                accessibilityLabel="Zip code input"
                accessibilityHint="Enter your 5-digit zip code"
              />
              
              {zipError ? (
                <Text style={styles.errorText}>{zipError}</Text>
              ) : null}
              
              {zip.length > 0 && zip.length < 5 ? (
                <Text style={styles.helperText}>
                  {5 - zip.length} more digit{5 - zip.length !== 1 ? 's' : ''} needed
                </Text>
              ) : null}
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                We use your zip code to connect you with local prayer communities 
                and emergency contacts in your area.
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonSection}>
              <TouchableOpacity
                style={[
                  styles.finishButton,
                  (!zip || !validateZip(zip) || isLoading) && styles.buttonDisabled
                ]}
                onPress={handleFinishPressed}
                disabled={!zip || !validateZip(zip) || isLoading}
                accessibilityRole="button"
                accessibilityLabel="Complete setup"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={[
                    styles.finishButtonText,
                    (!zip || !validateZip(zip)) && styles.buttonTextDisabled
                  ]}>
                    COMPLETE SETUP
                  </Text>
                )}
              </TouchableOpacity>

              {/* Skip button - remove in production */}
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Skip setup"
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 42,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 40,
  },
  inputLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "white",
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
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
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
  helperText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  infoSection: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  infoText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  finishButton: {
    backgroundColor: "#28a745",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 280,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  buttonTextDisabled: {
    color: "#999999",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    textDecorationLine: "underline",
  },
};