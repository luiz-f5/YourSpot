import { LogBox } from "react-native";
LogBox.ignoreLogs(["InteractionManager has been deprecated"]);

import React from "react";
import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useSession } from "@/services/auth/session";
import { SessionProvider } from "@/services/auth/sessionProvider";

import "@/styles/global.css";

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
