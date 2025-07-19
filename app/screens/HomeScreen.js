// app/screens/HomeScreen.js - Updated with Enhanced SOS Button
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef } from "react";
import backgroundimage from "../../assets/image_33.jpg";
import logoimage from "../../assets/logo.png";
import { homescreenStyles } from "../styles/homescreen.styles";

export default function HomeScreen({ navigation }) {
  // Animation refs for pulsing effect
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const sosPressAnim = useRef(new Animated.Value(1)).current;

  const runOnboarding = async () => {
    console.log("ONBOARDING");
    await readOnboarded();
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

  // Handle SOS button press with animation
  const handleSosPress = () => {
    // Quick press animation
    Animated.sequence([
      Animated.timing(sosPressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sosPressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to SOS screen
    sosPressed();
  };

  // Start pulsing animation on mount
  useEffect(() => {
    const createPulseAnimation = (animValue, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1.1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start pulsing animations with different delays
    createPulseAnimation(pulseAnim1, 0).start();
    createPulseAnimation(pulseAnim2, 1000).start();

    runOnboarding();
  }, []);

  return (
    <SafeAreaView style={homescreenStyles.container}>
      <StatusBar style="light" />
      
      {/* Logo Section */}
      <View style={homescreenStyles.logoContainer}>
        <ImageBackground
          source={logoimage}
          resizeMode="center"
          style={homescreenStyles.logoimage}
        />
      </View>

      {/* Main Content */}
      <View style={homescreenStyles.mainContent}>
        
        {/* Enhanced SOS Button with Pulse Animation */}
        <View style={homescreenStyles.sosButtonContainer}>
          
          {/* Pulse Ring 2 (Outer) */}
          <Animated.View
            style={[
              homescreenStyles.pulseRing2,
              {
                transform: [{ scale: pulseAnim2 }],
                opacity: pulseAnim2.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [0.3, 0],
                }),
              },
            ]}
          />
          
          {/* Pulse Ring 1 (Middle) */}
          <Animated.View
            style={[
              homescreenStyles.pulseRing1,
              {
                transform: [{ scale: pulseAnim1 }],
                opacity: pulseAnim1.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [0.5, 0],
                }),
              },
            ]}
          />
          
          {/* Main Pulse Container */}
          <View style={homescreenStyles.pulseContainer} />
          
          {/* SOS Button */}
          <Animated.View
            style={[
              { transform: [{ scale: sosPressAnim }] }
            ]}
          >
            <TouchableOpacity
              style={homescreenStyles.sosButton}
              onPress={handleSosPress}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Emergency SOS Button"
              accessibilityHint="Tap to send an emergency prayer request"
            >
              <View style={homescreenStyles.sosButtonInner}>
                <Text style={homescreenStyles.sosButtonText}>SOS</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          
        </View>

        {/* Navigation Section */}
        <View style={homescreenStyles.navigationSection}>
          
          {/* Requests Button */}
          <TouchableOpacity
            style={[
              homescreenStyles.navButton,
              homescreenStyles.requestsButton,
            ]}
            onPress={requestsPressed}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Prayer Requests"
          >
            <View style={homescreenStyles.navButtonContent}>
              <Text style={homescreenStyles.navButtonIcon}>🙏</Text>
              <Text style={homescreenStyles.navButtonText}>PRAYER REQUESTS</Text>
            </View>
            <Text style={homescreenStyles.navButtonArrow}>›</Text>
          </TouchableOpacity>

          {/* Warrior Book Button */}
          <TouchableOpacity
            style={[
              homescreenStyles.navButton,
              homescreenStyles.warriorBookButton,
            ]}
            onPress={warriorBookPressed}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Warrior Book"
          >
            <View style={homescreenStyles.navButtonContent}>
              <Text style={homescreenStyles.navButtonIcon}>⚔️</Text>
              <Text style={homescreenStyles.navButtonText}>WARRIOR BOOK</Text>
            </View>
            <Text style={homescreenStyles.navButtonArrow}>›</Text>
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity
            style={[
              homescreenStyles.navButton,
              homescreenStyles.settingsButton,
            ]}
            onPress={settingsPressed}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <View style={homescreenStyles.navButtonContent}>
              <Text style={homescreenStyles.navButtonIcon}>⚙️</Text>
              <Text style={homescreenStyles.navButtonText}>SETTINGS</Text>
            </View>
            <Text style={homescreenStyles.navButtonArrow}>›</Text>
          </TouchableOpacity>

        </View>
      </View>
      
    </SafeAreaView>
  );
}