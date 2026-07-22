import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function NotFoundScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 items-center justify-center bg-[#F9F9F6]">
      <Text className="text-5xl font-bold text-zinc-900">404</Text>
      <Text className="text-lg my-8 text-zinc-700">Page not found</Text>

      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text className="text-base text-zinc-900 font-semibold underline mt-8">
          Go back home
        </Text>
      </TouchableOpacity>
    </View>
  );
}
