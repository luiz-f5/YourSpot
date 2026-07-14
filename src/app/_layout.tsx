import { LogBox } from "react-native";
LogBox.ignoreLogs(["InteractionManager has been deprecated"]);
import React from "react";
import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider, useSession } from "@/src/ctx";
import "@/global.css";

export default function RootLayout() {
  return (
    <SessionProvider>
      <GluestackUIProvider mode="dark">
        <RootNavigator />
      </GluestackUIProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
