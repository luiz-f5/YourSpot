import React from "react";
import { View, Dimensions } from "react-native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface CardAuthProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const windowWidth = Dimensions.get("window").width;
const CARD_WIDTH = Math.min(windowWidth * 0.88, 380);

export default function CardAuth({ title, subtitle, children }: CardAuthProps) {
  return (
    <View
      className="bg-white/90 rounded-3xl p-6 border border-white/80 shadow-lg z-10"
      style={{ width: CARD_WIDTH }}
    >
      <Heading className="text-zinc-900 font-bold mb-0.5" size="lg">
        {title}
      </Heading>
      <Text className="text-zinc-500 text-xs mb-5 font-medium">
        {subtitle}
      </Text>
      {children}
    </View>
  );
}
