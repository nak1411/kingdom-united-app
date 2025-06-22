import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
} from "react-native";
import {requestsscreenStyles} from "../styles/requestsscreen.styles"
import backgroundimage from "../../assets/image_33.jpg";

export default function RequestsScreen({ navigation }) {
  const backPressed = () => {
    console.log("Back");
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={requestsscreenStyles.container}>
      <ImageBackground
        source={backgroundimage}
        resizeMode="stretch"
        style={requestsscreenStyles.backgroundimage}
      >
        <StatusBar style="light" />
        <Text style={requestsscreenStyles.title}>Requests</Text>

        <View style={{ flex: 1, marginBottom: 80, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={requestsscreenStyles.backbutton}
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
