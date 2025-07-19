import { StatusBar, Alert, Keyboard, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import backgroundimage from "../../assets/image_33.jpg";
import { userUtils } from "../utils/user.js";
import { validation } from "../config/api.js";

export default function SettingsScreen({ navigation }) {
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
      console.log('Loaded user data:', data);
    } catch (error) {
      console.error('Failed to load user data:', error);
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
  const handleZipChange = useCallback((value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setNewZip(numericValue);
    
    // Clear error when user starts typing
    if (zipError) {
      setZipError("");
    }
    
    // Check if there are unsaved changes
    setHasUnsavedChanges(numericValue !== currentZip);
  }, [zipError, currentZip]);

  // Save zip code changes
  const handleSaveZip = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();
    
    // Validate zip code
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
      // Update zip code using utility function
      await userUtils.updateUserData({ zip: newZip });
      
      // Update local state
      setCurrentZip(newZip);
      setHasUnsavedChanges(false);
      
      Alert.alert(
        "Zip Code Updated! 📍",
        `Your location has been updated to ${newZip}. You'll now see prayer requests from your new area.`,
        [{ text: "OK" }]
      );
      
      console.log('Zip code updated to:', newZip);
    } catch (error) {
      console.error('Failed to update zip code:', error);
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

  // Clear all app data and restart onboarding
  const handleResetApp = async () => {
    Alert.alert(
      "Reset App Data",
      "This will clear all your data and restart the app setup process. Are you sure you want to continue?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        {
          text: "Reset App",
          style: "destructive",
          onPress: confirmResetApp
        }
      ]
    );
  };

  // Restart app function with fallback methods
  const restartApp = async () => {
    try {
      // Method 1: Try react-native-restart if available
      const RNRestart = require('react-native-restart');
      if (RNRestart && RNRestart.restart) {
        console.log('Using RNRestart.restart()');
        RNRestart.restart();
        return;
      }
    } catch (error) {
      console.log('RNRestart not available:', error.message);
    }

    try {
      // Method 2: Try react-native-restart default export
      const RNRestart = require('react-native-restart').default;
      if (RNRestart && RNRestart.restart) {
        console.log('Using RNRestart.default.restart()');
        RNRestart.restart();
        return;
      }
    } catch (error) {
      console.log('RNRestart.default not available:', error.message);
    }

    try {
      // Method 3: Try BackHandler exit (Android only)
      if (BackHandler && BackHandler.exitApp) {
        console.log('Using BackHandler.exitApp()');
        BackHandler.exitApp();
        return;
      }
    } catch (error) {
      console.log('BackHandler.exitApp not available:', error.message);
    }

    // Method 4: Manual restart instruction
    Alert.alert(
      "Restart Required",
      "Please manually close and reopen the app to complete the reset. The app data has been cleared successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            // Navigate to onboarding manually as fallback
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const confirmResetApp = async () => {
    setIsResetting(true);
    
    try {
      console.log('Resetting app data...');
      
      // Clear all user data using utility function
      await userUtils.clearUserData();
      
      // Additional cleanup for any other stored data
      await AsyncStorage.multiRemove([
        'prayer',
        'lastUpdateTime',
        'userPreferences'
      ]);
      
      console.log('App data cleared successfully');
      
      // Show confirmation and restart
      Alert.alert(
        "App Reset Complete",
        "The app data has been cleared. The app will now restart.",
        [
          {
            text: "Restart Now",
            onPress: () => {
              setTimeout(() => {
                restartApp();
              }, 500);
            }
          }
        ],
        { cancelable: false }
      );
      
    } catch (error) {
      console.error('Failed to reset app:', error);
      Alert.alert(
        "Reset Failed",
        "There was an error resetting the app. Please try again or restart the app manually.",
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
            }
          },
          {
            text: "Save",
            onPress: async () => {
              await handleSaveZip();
              if (!zipError) {
                navigation.navigate("Home");
              }
            }
          }
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
      `Kingdom United App v1.0.0\n\nUser ID: ${userData?.userId || 'Unknown'}\nCurrent Zip: ${currentZip || 'Not set'}\nSetup Complete: ${userData?.isOnboarded ? 'Yes' : 'No'}`,
      [{ text: "OK" }]
    );
  };

  // Component mount
  useEffect(() => {
    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={backgroundimage} resizeMode="stretch" style={styles.backgroundimage}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading settings...</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={backgroundimage}
          resizeMode="stretch"
          style={styles.backgroundimage}
        >
          <StatusBar style="light" />
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Settings</Text>
              <Text style={styles.subtitle}>
                Manage your location and app preferences
              </Text>
            </View>

            {/* Current Location Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Current Location</Text>
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
              <Text style={styles.sectionTitle}>✏️ Update Location</Text>
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>NEW ZIP CODE</Text>
                <TextInput
                  value={newZip}
                  onChangeText={handleZipChange}
                  maxLength={5}
                  style={[
                    styles.input,
                    zipError ? styles.inputError : null,
                    hasUnsavedChanges ? styles.inputChanged : null
                  ]}
                  placeholder="Enter 5-digit zip code"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={handleSaveZip}
                  editable={!isSaving}
                  accessibilityLabel="New zip code input"
                  accessibilityHint="Enter your new 5-digit zip code"
                />
                
                {zipError ? (
                  <Text style={styles.errorText}>{zipError}</Text>
                ) : null}
                
                {newZip.length > 0 && newZip.length < 5 ? (
                  <Text style={styles.helperText}>
                    {5 - newZip.length} more digit{5 - newZip.length !== 1 ? 's' : ''} needed
                  </Text>
                ) : null}
                
                {hasUnsavedChanges && validateZip(newZip) ? (
                  <Text style={styles.changedText}>
                    ✓ Ready to save new location
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
                        (!newZip || !validateZip(newZip) || isSaving) && styles.buttonDisabled
                      ]}
                      onPress={handleSaveZip}
                      disabled={!newZip || !validateZip(newZip) || isSaving}
                    >
                      {isSaving ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={[
                          styles.saveButtonText,
                          (!newZip || !validateZip(newZip)) && styles.buttonTextDisabled
                        ]}>
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
              <Text style={styles.sectionTitle}>⚙️ App Management</Text>
              
              <TouchableOpacity
                style={styles.actionCard}
                onPress={showAppInfo}
                activeOpacity={0.7}
              >
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>ℹ️ App Information</Text>
                  <Text style={styles.actionDescription}>
                    View app version and user details
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
                  <Text style={styles.actionTitle}>🔄 Reset App</Text>
                  <Text style={styles.actionDescription}>
                    Clear all data and restart setup process
                  </Text>
                </View>
                {isResetting ? (
                  <ActivityIndicator color="#dc3545" size="small" />
                ) : (
                  <Text style={styles.actionArrow}>›</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                Your zip code is used to connect you with local prayer communities 
                and show relevant prayer requests in your area. All data is stored 
                securely and your privacy is protected.
              </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  currentLocationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentLocationLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 5,
  },
  currentLocationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  currentLocationNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: "#f8f9fa",
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: 10,
  },
  inputError: {
    borderColor: "#dc3545",
    backgroundColor: "#f8d7da",
  },
  inputChanged: {
    borderColor: "#007bff",
    backgroundColor: "#e3f2fd",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "500",
  },
  helperText: {
    color: "#6c757d",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  changedText: {
    color: "#28a745",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "500",
  },
  zipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonTextDisabled: {
    color: '#999999',
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionArrow: {
    fontSize: 24,
    color: '#666',
    marginLeft: 10,
  },
  infoSection: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSection: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '600',
  },
};