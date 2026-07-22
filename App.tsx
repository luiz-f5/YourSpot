import { LogBox } from "react-native";
LogBox.ignoreLogs(["InteractionManager has been deprecated"]);

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "./src/components/ui/gluestack-ui-provider";
import { SessionProvider } from "./src/services/auth/sessionProvider";
import RootNavigator from "./src/navigation/RootNavigator";

import "./src/styles/global.css";

export default function App() {
  return (
    <SessionProvider>
      <SafeAreaProvider>
        <GluestackUIProvider mode="light">
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </SessionProvider>
  );
}
