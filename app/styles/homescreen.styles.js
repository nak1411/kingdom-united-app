import { StatusBar, StyleSheet } from "react-native";

export const homescreenStyles = StyleSheet.create({
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
