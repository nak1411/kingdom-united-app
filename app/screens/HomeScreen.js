import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { useEffect } from "react";
import backgroundimage from "../../assets/image_33.jpg";
import logoimage from "../../assets/logo.png";
import { homescreenStyles } from "../styles/homescreen.styles";

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

  const warriorBookPressed = () => {
    console.log("WARRIOR BOOK");
    navigation.navigate("WarriorBook");
  };

  useEffect(() => {
    runOnboarding();
  });

  return (
    <SafeAreaView style={homescreenStyles.container}>

      <ImageBackground
        source={logoimage}
        resizeMode="center"
        style={homescreenStyles.logoimage}
      ></ImageBackground>

      <StatusBar style="light" />
      <TouchableOpacity
        style={homescreenStyles.sosbutton}
        onPress={() => sosPressed()}
      >
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
          style={homescreenStyles.requestsbutton}
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
            source={require("../../assets/image_33.jpg")}
          ></ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={homescreenStyles.warriorbookbutton}
          onPress={() => warriorBookPressed()}
        >
          <Text
            style={{
              color: "black",
              fontSize: 30,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            WARRIOR BOOK ⚔️
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={homescreenStyles.settingsbutton}
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
    </SafeAreaView>
  );
}