import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
} from "react-native";
import {settingsscreenStyles} from "../styles/settingsscreen.styles"
import backgroundimage from "../../assets/image_33.jpg";

export default function SettingsScreen({ navigation }) {
  const [zip, setZip] = useState(0);

  const clearDataPressed = async () => {
    console.log("DATA CLEARED");
    setZip(0);
    try {
      await AsyncStorage.setItem("onboarded", "false");
      await AsyncStorage.removeItem("zip");
      await AsyncStorage.removeItem("prayer");
    } catch (error) {}

    RNRestart.restart();
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

  const backPressed = () => {
    console.log("Back");
    navigation.navigate("Home");
  };

  useEffect(() => {
    readZip();
  }, []);

  return (
    <SafeAreaView style={settingsscreenStyles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={settingsscreenStyles.backgroundimage}
      >
        <StatusBar style="light" />
        <Text style={settingsscreenStyles.title}>Settings</Text>

        <Text style={settingsscreenStyles.currentzip}>
          CURRENT ZIP: {"\n"}
          {zip}
        </Text>
        <TextInput maxLength={5} style={settingsscreenStyles.input} onChangeText={storeZip} />

        <View style={{ flex: 1, marginBottom: 80, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={settingsscreenStyles.resetbutton}
            onPress={() => clearDataPressed()}
          >
            <Text style={{ color: "black", fontSize: 30, alignSelf: "center"}}>CLEAR DATA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={settingsscreenStyles.backbutton}
            onPress={() => backPressed()}
          >
            <Text style={{ color: "black", fontSize: 30, alignSelf: "center" }}>BACK</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
