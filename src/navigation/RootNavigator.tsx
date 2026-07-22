import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession } from "@/services/auth/session";

// Import screens
import LoginScreen from "@/src/screens/auth/LoginScreen";
import RegisterScreen from "@/src/screens/auth/RegisterScreen";
import HomeScreen from "@/src/screens/tabs/HomeScreen";
import ContactsScreen from "@/src/screens/tabs/ContactsScreen";
import SettingsScreen from "@/src/screens/tabs/SettingsScreen";
import AboutScreen from "@/src/screens/tabs/AboutScreen";
import ReportScreen from "@/src/screens/ReportScreen";
import MyReportsScreen from "@/src/screens/MyReportsScreen";
import NotFoundScreen from "@/src/screens/NotFoundScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#F9F9F6" } }}>
      {session ? (
        // Authorized screens (no clunky bottom tabs or drawer, managed via custom floating HomeMenu)
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Contacts" component={ContactsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="MyReports" component={MyReportsScreen} />
        </>
      ) : (
        // Non-authorized screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}
