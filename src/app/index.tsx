import React from "react";
import { StyleSheet, View } from "react-native";
import MyText from "../components/Text";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <MyText />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "gray",
    textAlign: "center",
  },
});
