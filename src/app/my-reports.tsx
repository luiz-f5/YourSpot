import React, { useState, useEffect } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, MapPin, Calendar, Trash2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyReportsScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);

  const loadReports = async () => {
    try {
      const data = await AsyncStorage.getItem("@user_reports");
      if (data) {
        setReports(JSON.parse(data));
      }
    } catch (error) {
      console.log("Erro ao carregar histórico");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const clearHistory = async () => {
    await AsyncStorage.removeItem("@user_reports");
    setReports([]);
  };

  return (
    <View className="flex-1 bg-[#F9F9F6] pt-12">
      {/* CABEÇALHO */}
      <View className="px-6 mb-4">
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.canGoBack() ? router.back() : router.replace("/(drawer)/(tabs)")} className="flex-row items-center mb-3 self-start">
          <Icon as={ArrowLeft} size="md" className="text-zinc-900" />
          <Text className="text-zinc-900 font-semibold ml-1.5">Voltar</Text>
        </TouchableOpacity>
        <Heading size="xl" className="text-zinc-900 font-bold">Meus Locais & Denúncias</Heading>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {reports.length === 0 ? (
          <View className="mt-16 items-center px-6">
            <Text className="text-zinc-500 text-sm font-medium">Você ainda não registrou nenhuma denúncia.</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={clearHistory} className="flex-row items-center mb-3 self-end px-6">
              <Icon as={Trash2} size="xs" className="text-red-600 mr-1.5" />
              <Text className="text-red-600 text-xs font-semibold">Limpar Histórico</Text>
            </TouchableOpacity>

            {reports.map((item) => (
              <View key={item.id} className="bg-white rounded-2xl border border-zinc-200/50 mb-4 overflow-hidden flex-row mx-6">
                <Image source={{ uri: item.image }} className="w-[100px] h-full bg-zinc-200" style={{ minHeight: 110 }} />
                <View className="flex-1 p-3">
                  <View className="flex-row items-center mb-1">
                    <Icon as={Calendar} size="xs" className="text-zinc-500 mr-1" />
                    <Text className="text-[11px] text-zinc-500 font-semibold">{item.date}</Text>
                  </View>

                  <Text className="text-sm font-bold text-zinc-900 mb-1.5">{item.problems.join(", ")}</Text>

                  <View className="flex-row items-center mb-1">
                    <Icon as={MapPin} size="xs" className="text-red-600 mr-1" />
                    <Text className="text-xs text-zinc-600 font-semibold flex-1" numberOfLines={1}>{item.address}</Text>
                  </View>

                  {item.observation ? (
                    <Text className="text-[11px] text-zinc-500 italic mt-0.5" numberOfLines={2}>Obs: {item.observation}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
