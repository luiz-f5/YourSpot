import { Drawer } from "expo-router/drawer";

export default function MyDrawer() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "YourSpot",
        headerTintColor: "#1C1C1E",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#F9F9F6",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E5DE",
        },
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 18,
          letterSpacing: -0.3,
        },
        drawerStyle: {
          backgroundColor: "#F9F9F6",
          width: 240,
        },
        drawerActiveBackgroundColor: "#E5E5DE",
        drawerActiveTintColor: "#1C1C1E",
        drawerInactiveTintColor: "#666666",
        drawerLabelStyle: {
          fontWeight: "700",
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Início",
        }}
      />
    </Drawer>
  );
}
