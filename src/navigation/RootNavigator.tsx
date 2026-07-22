import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession, getSessionExpiry } from "@/services/auth/session";

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
  const { session, signOut } = useSession();

  useEffect(() => {
    if (!session) return;

    const checkExpiry = async () => {
      let expiry = await getSessionExpiry();
      if (expiry) {
        if (expiry < 10000000000) {
          expiry = expiry * 1000;
        }
        if (Date.now() >= expiry) {
          await signOut();
        }
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 5000); // verifica a cada 5 segundos
    return () => clearInterval(interval);
  }, [session, signOut]);

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
