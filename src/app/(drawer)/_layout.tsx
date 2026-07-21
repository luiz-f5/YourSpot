import { Drawer } from "expo-router/drawer";

export default function MyDrawer() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
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
