import { Drawer } from "expo-router/drawer";
import { UserRound } from "lucide-react-native";

export default function MyDrawer() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "Menu",
        headerTintColor: "yellow",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#494e57" }
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
      <Drawer.Screen
        name="contacts"
        options={{
          headerShown: false,
          title: "Contatos",
          drawerLabel: "Contatos",
          drawerLabelStyle: {
            color: "green",
          },
          drawerIcon: ({ color, size }) => <UserRound color={color} size={size} />
        }}
      />
    </Drawer>
  );
}