import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
} from "react-native";

import backgroundimage from "../assets/image_33.jpg";

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
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={styles.backgroundimage}
      >
        <StatusBar style="light" />
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.currentzip}>
          CURRENT ZIP: {"\n"}
          {zip}
        </Text>
        <TextInput maxLength={5} style={styles.input} onChangeText={storeZip} />

        <View style={{ flex: 1, marginBottom: 80, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.resetbutton}
            onPress={() => clearDataPressed()}
          >
            <Text style={{ color: "black", fontSize: 30, alignSelf: "center"}}>CLEAR DATA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backbutton}
            onPress={() => backPressed()}
          >
            <Text style={{ color: "black", fontSize: 30, alignSelf: "center" }}>BACK</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3e3e3e",
    paddingTop: StatusBar.currentHeight,
  },

  input: {
    margin: 20,
    color: "black",
    fontSize: 50,
    backgroundColor: "white",
    minHeight: 100,
    maxHeight: 100,
    textAlign: "center",
    borderWidth: 2,
  },

  resetbutton: {
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "gray",
    backgroundColor: "#004060",
    width: 250,
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
  },

  backbutton: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "gray",
    backgroundColor: "#004060",
    width: 250,
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
  },

  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 40,
    paddingBottom: 10,
    textAlign: "center",
  },

  currentzip: {
    color: "black",
    fontSize: 30,
    paddingTop: 50,
    textAlign: "center",
  },

  backgroundimage: {
    flex: 1,
    justifyContent: "center",
  },
});
