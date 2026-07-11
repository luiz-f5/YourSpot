import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        options={{
          title: "Home",
          headerTitleAlign: "center",
          headerTintColor: "whitesmoke",
          headerStyle: { backgroundColor: "#494e57" },
        }}
        name="index"
      />
    </Stack>
  );
}
