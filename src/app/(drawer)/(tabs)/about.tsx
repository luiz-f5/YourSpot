import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F9F9F6] p-6 pt-12">
      {/* Botão de Voltar */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.back()}
        className="mb-8 py-2 self-start"
      >
        <Text className="text-zinc-900 font-medium text-base">← Voltar</Text>
      </TouchableOpacity>

      <Heading className="text-zinc-900 mb-6 font-bold" size="2xl">
        Sobre o App
      </Heading>

      <Card className="p-5 rounded-3xl bg-white border border-[#E5E5DE]">
        <Text className="text-zinc-900 text-sm leading-relaxed font-medium">
          Este aplicativo foi totalmente remodelado para uma experiência minimalista e fluida, utilizando o conceito Liquid Glass e paleta de cores Off-White.
        </Text>
      </Card>
    </View>
  );
}
