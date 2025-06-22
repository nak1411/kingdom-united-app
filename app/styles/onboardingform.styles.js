import { StatusBar, StyleSheet } from "react-native";

export const onboardingformStyles = StyleSheet.create({
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