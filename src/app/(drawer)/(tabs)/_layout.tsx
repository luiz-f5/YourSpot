import { Tabs } from "expo-router";
import { tabsConstants } from "@/src/constants/RouterLayouts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1C1C1E",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5DE",
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
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
            tabBarIcon: ({ color }) => {
              const IconComponent = tab.component;
              return <IconComponent color={color} size={18} />;
            },
          }}
        />
      ))}
    </Tabs>
  );
}
