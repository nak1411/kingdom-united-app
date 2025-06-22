import { StatusBar, StyleSheet } from "react-native";

export const sosscreenStyles = StyleSheet.create({
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