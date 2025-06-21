import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingForm from "./onboarding/OnboardingForm.js";
import HomeScreen from "./screens/HomeScreen.js";
import SosScreen from "./screens/SosScreen.js";
import RequestsScreen from "./screens/RequestsScreen.js";
import SettingsScreen from "./screens/SettingsScreen.js";
import { useState, useEffect } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [onboarded, setIsOnboarded] = useState("false");

  const readOnboarded = async () => {
    try {
      const onboarded = await AsyncStorage.getItem("onboarded");
      if (onboarded !== null) {
        setIsOnboarded(onboarded);
        console.log(onboarded);
      }
    } catch (error) {}
  };

  useEffect(() => {
    readOnboarded();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {onboarded === "false" && (
          <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}
            component={OnboardingForm}
          />
        )}

        <Stack.Screen
          name="Home"
          options={{ headerShown: false, animation: "fade_from_bottom" }}
          component={HomeScreen}
        />

        <Stack.Screen
          name="Sos"
          options={{ headerShown: false, animation: "fade_from_bottom" }}
          component={SosScreen}
        />
        <Stack.Screen
          name="Requests"
          options={{ headerShown: false, animation: "fade_from_bottom" }}
          component={RequestsScreen}
        />
        <Stack.Screen
          name="Settings"
          options={{ headerShown: false, animation: "fade_from_bottom" }}
          component={SettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
