import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { useEffect } from "react";
import backgroundimage from "../assets/image_33.jpg";
import logoimage from "../assets/logo.png";

export default function HomeScreen({ navigation }) {
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

  useEffect(() => {
    runOnboarding();
  });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={styles.backgroundimage}
      >
        <ImageBackground
          source={logoimage}
          resizeMode="center"
          style={styles.logoimage}
        ></ImageBackground>

        <StatusBar style="light" />
        <TouchableOpacity style={styles.sosbutton} onPress={() => sosPressed()}>
          <Text
            style={{
              color: "#fff",
              fontSize: 60,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            SOS
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginTop: 80 }}>
          <TouchableOpacity
            style={styles.requestsbutton}
            onPress={() => requestsPressed()}
          >
            <Text
              style={{
                color: "black",
                fontSize: 30,
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              REQUESTS
            </Text>
            <ImageBackground
              source={require("../assets/image_33.jpg")}
            ></ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsbutton}
            onPress={() => settingsPressed()}
          >
            <Text
              style={{
                color: "black",
                fontSize: 30,
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              SETTINGS
            </Text>
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
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
  },

  sosbutton: {
    borderRadius: 100,
    borderWidth: 5,
    backgroundColor: "#af212d",
    width: 200,
    height: 200,
    marginTop: 50,
    justifyContent: "center",
    alignSelf: "center",
  },

  settingsbutton: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "gray",
    backgroundColor: "#004060",
    width: 250,
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
  },

  requestsbutton: {
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

  backgroundimage: {
    flex: 1,
    justifyContent: "center",
  },

  logoimage: {
    flex: 1,
    justifyContent: "center",
    marginTop: 20,
  },
});
