import { Tabs } from "expo-router";
import { Icon, MenuIcon, SettingsIcon, InfoIcon } from "@/components/ui/icon";
import { Home } from "lucide-react-native";
export default function MyTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "greenyellow",
        tabBarInactiveTintColor: "whitesmoke",
        tabBarStyle: { backgroundColor: "#494e57", borderColor: "yellow" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: () => <Icon color="cyan" as={Home} size="lg" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: () => <Icon color="cyan" as={SettingsIcon} size="lg" />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerShown: false,
          tabBarIcon: () => <Icon color="cyan" as={InfoIcon} size="lg" />,
        }}
      />
      <Tabs.Screen
        name="(drawer)"
        options={{
          headerShown: false,
          tabBarIcon: () => <Icon color="cyan" as={MenuIcon} size="lg" />,
        }}
      />
    </Tabs>
  );
}
