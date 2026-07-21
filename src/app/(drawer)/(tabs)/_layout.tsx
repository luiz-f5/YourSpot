import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { tabsConstants } from "@/src/constants/RouterLayouts"; 
export default function MyTabs() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "greenyellow",
        tabBarInactiveTintColor: "whitesmoke",
        tabBarStyle: { backgroundColor: "#494e57", borderColor: "yellow" },
      }}
      
    >
      {tabsConstants.map((tab, index) => (
<Tabs.Screen
        name={tab.name}
        
        key={index}
        options={{
          headerShown: false,
          title: tab.title,
          tabBarIcon: () => <Icon color="cyan" as={tab.component} size="lg" />,
        }}
      />
      ))}
      
    </Tabs>
  );
}
