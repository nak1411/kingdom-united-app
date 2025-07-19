import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";

import OnboardingForm from "./screens/OnboardingForm.js";
import HomeScreen from "./screens/HomeScreen.js";
import SosScreen from "./screens/SosScreen.js";
import RequestsScreen from "./screens/RequestsScreen.js";
import SettingsScreen from "./screens/SettingsScreen.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(null); // null = loading, false = not onboarded, true = onboarded
  const [isLoading, setIsLoading] = useState(true);

  const checkOnboardingStatus = async () => {
    try {
      const onboardedValue = await AsyncStorage.getItem("onboarded");
      console.log('Onboarding status:', onboardedValue);
      
      // Convert string to boolean
      setIsOnboarded(onboardedValue === "true");
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      // Default to not onboarded if there's an error
      setIsOnboarded(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Show loading screen while checking onboarding status
  if (isLoading) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={loadingStyles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      >
        {!isOnboarded ? (
          // Show onboarding if user hasn't completed setup
          <Stack.Screen
            name="Onboarding"
            component={OnboardingForm}
            options={{
              animation: "none", // No animation for initial screen
            }}
          />
        ) : null}

        {/* Main app screens */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Sos"
          component={SosScreen}
        />
        
        <Stack.Screen
          name="Requests"
          component={RequestsScreen}
        />
        
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const loadingStyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3e3e3e',
  },
  text: {
    marginTop: 16,
    color: 'white',
    fontSize: 16,
  },
};