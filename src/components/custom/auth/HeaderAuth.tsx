import React from "react";
import { View } from "react-native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { MapPin } from "lucide-react-native";

interface HeaderAuthProps {
  subtitle: string;
}

export default function HeaderAuth({ subtitle }: HeaderAuthProps) {
  return (
    <View className="items-center mb-6 z-10">
      <View className="w-16 h-16 rounded-full bg-white justify-center items-center border border-zinc-100 shadow-md mb-3">
        <Icon as={MapPin} size="xl" className="text-zinc-900" />
      </View>
      <Heading className="text-zinc-900 font-extrabold tracking-tight" size="2xl">
        YourSpot
      </Heading>
      <Text className="text-zinc-600 text-xs text-center mt-1 max-w-[280px] font-medium leading-relaxed">
        {subtitle}
      </Text>
    </View>
  );
}
