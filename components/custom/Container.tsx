import { StyleSheet, View } from "react-native";
import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
