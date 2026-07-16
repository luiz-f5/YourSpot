import { Drawer } from "expo-router/drawer";

export default function MyDrawer() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "Menu",
        headerTintColor: "yellow",
        headerTitleAlign : "center",
        headerStyle: {backgroundColor: "#494e57"}
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          drawerLabelStyle: {
            color: "green",
          },
          
        }}
      />
    </Drawer>
  );
}
