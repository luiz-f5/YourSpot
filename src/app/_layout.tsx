import React from "react";
import { Stack } from "expo-router";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function RootLayout() {
  return (
    
    <GluestackUIProvider mode="dark">
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
    </GluestackUIProvider>
  
  );
}
