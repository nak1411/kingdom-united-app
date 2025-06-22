import { StatusBar, StyleSheet } from "react-native";

export const settingsscreenStyles = StyleSheet.create({
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