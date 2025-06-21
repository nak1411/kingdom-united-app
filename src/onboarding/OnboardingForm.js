import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";

import backgroundimage from "../assets/image_33.jpg";

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
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={styles.backgroundimage}
      >
        <StatusBar style="light" />

        <Text style={styles.title}>Setup</Text>
        <Text style={styles.currentzip}>ZIPCODE</Text>

        <TextInput maxLength={5} style={styles.input} onChangeText={storeZip} />

        <View style={{ flex: 1, marginBottom: 80, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.finishbutton}
            onPress={() => finishPressed()}
          >
            <Text style={{ color: "black", fontSize: 30 }}>FINISH</Text>
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
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    color: "black",
    fontSize: 50,
    backgroundColor: "white",
    minHeight: 100,
    maxHeight: 100,
    textAlign: "center",
    borderWidth: 2,
  },

  clearbutton: {
    borderRadius: 5,
    backgroundColor: "lightgray",
    width: 250,
    height: 60,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  finishbutton: {
    borderRadius: 5,
    backgroundColor: "lightgray",
    width: 250,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 40,
    paddingBottom: 10,
    textAlign: "center",
  },

  currentzip: {
    color: "white",
    fontSize: 30,
    paddingTop: 50,
    textAlign: "center",
  },

  backgroundimage: {
    flex: 1,
    justifyContent: "center",
  },
});
