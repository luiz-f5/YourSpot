import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { useNavigation } from "@react-navigation/native";

interface FooterLinkAuthProps {
  promptText: string;
  linkText: string;
  href: string;
}

export default function FooterLinkAuth({ promptText, linkText, href }: FooterLinkAuthProps) {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-row justify-center items-center mt-5">
      <Text className="text-zinc-500 text-xs font-medium">
        {promptText}
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate(href)}>
        <Text className="text-zinc-900 font-extrabold text-xs underline ml-1">
          {linkText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
