import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import {onboardingformStyles} from "../styles/onboardingform.styles"
import backgroundimage from "../../assets/image_33.jpg";


export default function OnboardingForm({ navigation }) {
  const [zip, setZip] = useState(0);

  const storeOnboarded = async (value) => {
    try {
      await AsyncStorage.setItem("onboarded", value);
    } catch (error) {}
  };

  const storeZip = async (value) => {
    try {
      await AsyncStorage.setItem("zip", value);
      setZip(value);
    } catch (error) {}
  };

  const readZip = async () => {
    try {
      const zip = await AsyncStorage.getItem("zip");
      if (zip !== null) {
        storeZip(zip);
      }
    } catch (error) {}
  };

  const finishPressed = () => {
    storeOnboarded("true");
    navigation.navigate("Home");
  };

  useEffect(() => {
    readZip();
  }, []);

  return (
    <SafeAreaView style={onboardingformStyles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={onboardingformStyles.backgroundimage}
      >
        <StatusBar style="light" />

        <Text style={onboardingformStyles.title}>Setup</Text>
        <Text style={onboardingformStyles.currentzip}>ZIPCODE</Text>

        <TextInput maxLength={5} style={onboardingformStyles.input} onChangeText={storeZip} />

        <View style={{ flex: 1, marginBottom: 80, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={onboardingformStyles.finishbutton}
            onPress={() => finishPressed()}
          >
            <Text style={{ color: "black", fontSize: 30 }}>FINISH</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
