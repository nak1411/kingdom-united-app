import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground
} from "react-native";

import backgroundimage from "../assets/image_33.jpg";

export default function SosScreen({ navigation }) {
  const [prayer, setPrayer] = useState("");

  const storePrayer = async (value) => {
    try {
      await AsyncStorage.setItem("prayer", value);
      setPrayer(value);
    } catch (error) {}
  };

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
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={styles.backgroundimage}
      >
        <StatusBar style="light" />
        <Text style={styles.title}>Your Prayer</Text>

        <TextInput
          multiline={true}
          numberOfLines={3}
          maxLength={120}
          onChangeText={storePrayer}
          style={styles.input}
        />

        <Text style={styles.prayertext}>{prayer}</Text>

        <View style={{ flex: 1, marginBottom: 80, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.sendbutton}
            onPress={() => sendPressed()}
          >
            <Text style={{ color: "black", fontSize: 30 }}>SEND!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backbutton}
            onPress={() => backPressed()}
          >
            <Text style={{ color: "black", fontSize: 30 }}>BACK</Text>
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
    fontSize: 30,
    backgroundColor: "white",
    minHeight: 200,
    maxHeight: 200,
    textAlignVertical: "top",
    borderWidth: 2,
  },

  sendbutton: {
    borderRadius: 5,
    backgroundColor: "lightgray",
    width: 250,
    height: 60,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  backbutton: {
    borderRadius: 5,
    backgroundColor: "lightgray",
    width: 250,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 40,
    paddingBottom: 10,
    textAlign: "center",
  },

  prayertext: {
    color: "white",
    fontSize: 30,
    paddingTop: 100,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "left",
  },

  backgroundimage: {
    flex: 1,
    justifyContent: "center",
  },
});
