import { StatusBar, StyleSheet } from "react-native";

export const requestsscreenStyles = StyleSheet.create({
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