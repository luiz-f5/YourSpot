import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { tabsConstants } from "@/src/constants/RouterLayouts";

export default function MyTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1C1C1E",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5DE",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {tabsConstants.map((tab, index) => (
        <Tabs.Screen
          name={tab.name}
          key={index}
          options={{
            headerShown: false,
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <Icon color={color} as={tab.component} size="md" />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
