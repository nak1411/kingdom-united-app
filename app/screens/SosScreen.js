import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
} from "react-native";
import {sosscreenStyles} from "../styles/sosscreen.styles"

import backgroundimage from "../../assets/image_33.jpg";

export default function SosScreen({ navigation }) {
  const [prayer, setPrayer] = useState("");

  const storePrayer = async (value) => {
    try {
      await AsyncStorage.setItem("prayer", value);
      setPrayer(value);
    } catch (error) {}
  };

  //Read prayer
  const readPrayer = async () => {
    try {
      const prayer = await AsyncStorage.getItem("prayer");
      if (prayer !== null) {
        storePrayer(prayer);
      }
    } catch (error) {}
  };

  const sendPressed = async () => {
    console.log("Sent");
    setPrayer("");
    try {
      await AsyncStorage.setItem("prayer", "");
      await AsyncStorage.removeItem("prayer");
    } catch (error) {}
    navigation.navigate("Home");
  };

  const backPressed = () => {
    console.log("Back");
    navigation.navigate("Home");
  };

  useEffect(() => {
    readPrayer();
  }, []);

  return (
    <SafeAreaView style={sosscreenStyles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={sosscreenStyles.backgroundimage}
      >
        <StatusBar style="light" />
        <Text style={sosscreenStyles.title}>Your Prayer</Text>

        <TextInput
          multiline={true}
          numberOfLines={3}
          maxLength={120}
          onChangeText={storePrayer}
          style={sosscreenStyles.input}
        />

        <Text style={sosscreenStyles.prayertext}>{prayer}</Text>

        <View style={{ flex: 1, marginBottom: 80, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={sosscreenStyles.sendbutton}
            onPress={() => sendPressed()}
          >
            <Text style={{ color: "black", fontSize: 30 }}>SEND!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sosscreenStyles.backbutton}
            onPress={() => backPressed()}
          >
            <Text style={{ color: "black", fontSize: 30 }}>BACK</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
