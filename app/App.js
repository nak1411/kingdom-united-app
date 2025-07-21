// app/App.js - Updated with Theme Provider
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, StatusBar } from "react-native";

// Import Theme Provider
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Import Screens
import OnboardingForm from "./screens/OnboardingForm.js";
import HomeScreen from "./screens/HomeScreen.js";
import SosScreen from "./screens/SosScreen.js";
import RequestsScreen from "./screens/RequestsScreen.js";
import SettingsScreen from "./screens/SettingsScreen.js";
import WarriorBookScreen from "./screens/WarriorBookScreen.js";

const Stack = createNativeStackNavigator();

// Main App Component (wrapped with theme)
function AppContent() {
  const { colors, isDark } = useTheme();
  const [isOnboarded, setIsOnboarded] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkOnboardingStatus = async () => {
    try {
      const onboardedValue = await AsyncStorage.getItem("onboarded");
      console.log('Onboarding status:', onboardedValue);
      
      setIsOnboarded(onboardedValue === "true");
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      setIsOnboarded(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Loading screen with theme support
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.dark,
      }}>
        <StatusBar 
          barStyle={isDark ? "light-content" : "dark-content"} 
          backgroundColor={colors.background.dark}
        />
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={{
          marginTop: 16,
          color: colors.text.primary,
          fontSize: 16,
          fontWeight: '500',
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background.dark}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          contentStyle: { backgroundColor: colors.background.dark },
        }}
      >
        {!isOnboarded ? (
          // Show onboarding if user hasn't completed setup
          <Stack.Screen
            name="Onboarding"
            component={OnboardingForm}
            options={{
              animation: "none",
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

        <Stack.Screen
          name="WarriorBook"
          component={WarriorBookScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Root App Component with Theme Provider
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}