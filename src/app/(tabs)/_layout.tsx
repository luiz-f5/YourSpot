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
          title: "Home",
          tabBarIcon: () => <Icon color="cyan" as={Home} size="lg" />,
          headerTitleAlign: "center",
          headerTintColor: "whitesmoke",
          headerStyle: { backgroundColor: "#494e57" },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: () => <Icon color="cyan" as={SettingsIcon} size="lg" />,
          headerTitleAlign: "center",
          headerTintColor: "whitesmoke",
          headerStyle: { backgroundColor: "#494e57" },
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: () => <Icon color="cyan" as={InfoIcon} size="lg" />,
          headerTitleAlign: "center",
          headerTintColor: "whitesmoke",
          headerStyle: { backgroundColor: "#494e57" },
        }}
      />
      <Tabs.Screen
        name="(drawer)"
        options={{
          title: "Menu",
          tabBarIcon: () => <Icon color="cyan" as={MenuIcon} size="lg" />,
          headerTitleAlign: "center",
          headerTintColor: "whitesmoke",
          headerStyle: { backgroundColor: "#494e57" },
        }}
      />
    </Tabs>
  );
}
