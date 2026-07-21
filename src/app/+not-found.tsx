import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-5x1 font-bold">404</Text>
      <Text className="text-lg my-8">Page not found</Text>

      <Link href="/" className="text-base text-color mt-8">
        Go back home
      </Link>
    </View>
  );
}
