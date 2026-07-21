import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";

interface FooterLinkAuthProps {
  promptText: string;
  linkText: string;
  href: string;
}

export default function FooterLinkAuth({ promptText, linkText, href }: FooterLinkAuthProps) {
  return (
    <View className="flex-row justify-center items-center mt-5">
      <Text className="text-zinc-500 text-xs font-medium">
        {promptText}
      </Text>
      <Link href={href as any} asChild>
        <TouchableOpacity activeOpacity={0.7}>
          <Text className="text-zinc-900 font-extrabold text-xs underline">
            {linkText}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
