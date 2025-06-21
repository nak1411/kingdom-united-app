import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
} from "react-native";

import backgroundimage from "../assets/image_33.jpg";

export default function RequestsScreen({ navigation }) {
  const backPressed = () => {
    console.log("Back");
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={styles.backgroundimage}
      >
        <StatusBar style="light" />
        <Text style={styles.title}>Requests</Text>

        <View style={{ flex: 1, marginBottom: 80, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.backbutton}
            onPress={() => backPressed()}
          >
            <Text style={{ color: "black", fontSize: 30, alignSelf: "center" }}>
              BACK
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
    paddingTop: StatusBar.currentHeight,
  },

  input: {
    color: "black",
    backgroundColor: "white",
    height: 200,
    margin: 12,
    padding: 100,
    borderWidth: 2,
  },

  backbutton: {
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

  title: {
    color: "black",
    fontSize: 40,
    fontWeight: "bold",
    paddingBottom: 10,
    textAlign: "center",
  },

  backgroundimage: {
    flex: 1,
    justifyContent: "center",
  },
});
