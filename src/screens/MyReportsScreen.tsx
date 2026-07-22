import React, { useCallback } from "react";
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, MapPin, Calendar, Trash2 } from "lucide-react-native";
import { useReports } from "@/hooks/useReports";

export default function MyReportsScreen() {
  const navigation = useNavigation<any>();
  const { reports, loading, error, clearHistory, fetchReports } = useReports();

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [fetchReports])
  );

  const handleClearHistory = async () => {
    try {
      await clearHistory();
    } catch (err) {
      alert("Erro ao limpar histórico na API.");
    }
  };

  return (
    <View className="flex-1 bg-[#F9F9F6] pt-12">
      {/* CABEÇALHO */}
      <View className="px-6 mb-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home")}
          className="flex-row items-center mb-3 self-start"
        >
          <Icon as={ArrowLeft} size="md" className="text-zinc-900" />
          <Text className="text-zinc-900 font-semibold ml-1.5">Voltar</Text>
        </TouchableOpacity>
        <Heading size="xl" className="text-zinc-900 font-bold">Meus Locais & Denúncias</Heading>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1C1C1E" />
          <Text className="mt-3 font-semibold text-zinc-600">Carregando denúncias...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {error && (
            <View className="px-6 mb-4">
              <Text className="text-red-600 text-sm font-medium text-center">{error}</Text>
            </View>
          )}

          {reports.length === 0 ? (
            <View className="mt-16 items-center px-6">
              <Text className="text-zinc-500 text-sm font-medium">Você ainda não registrou nenhuma denúncia.</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity onPress={handleClearHistory} className="flex-row items-center mb-3 self-end px-6">
                <Icon as={Trash2} size="xs" className="text-red-600 mr-1.5" />
                <Text className="text-red-600 text-xs font-semibold">Limpar Histórico</Text>
              </TouchableOpacity>

              {reports.map((item) => (
                <View key={item.id} className="bg-white rounded-2xl border border-zinc-200/50 mb-4 overflow-hidden flex-row mx-6">
                  {item.image ? (
                    <Image source={{ uri: item.image }} className="w-[100px] h-full bg-zinc-200" style={{ minHeight: 110 }} />
                  ) : null}
                  <View className="flex-1 p-3">
                    <View className="flex-row items-center mb-1">
                      <Icon as={Calendar} size="xs" className="text-zinc-500 mr-1" />
                      <Text className="text-[11px] text-zinc-500 font-semibold">
                        {item.date || new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>

                    <Text className="text-sm font-bold text-zinc-900 mb-1.5">
                      {Array.isArray(item.problems) ? item.problems.join(", ") : item.problems || "Problema Geral"}
                    </Text>

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
      )}
    </View>
  );
}
