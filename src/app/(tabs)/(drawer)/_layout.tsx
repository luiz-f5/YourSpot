import { Drawer } from "expo-router/drawer";

export default function MyDrawer() {
  return (
    <Drawer
      screenOptions={{
        headerLeft: () => null,
        swipeEnabled: true,
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "overview",
        }}
      />
    </Drawer>
  );
}
