import React, { useState, useCallback } from "react";
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, MapPin, Calendar, Trash2, Mail, X } from "lucide-react-native";
import { useReports } from "@/hooks/useReports";
import { useContacts } from "@/hooks/useContacts";
import * as FileSystem from "expo-file-system/legacy";
import * as MailComposer from "expo-mail-composer";

export default function MyReportsScreen() {
  const navigation = useNavigation<any>();
  const { reports, loading, error, clearHistory, fetchReports, removeReport } = useReports();
  const { contacts, fetchContacts } = useContacts();

  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
      fetchContacts();
    }, [fetchReports, fetchContacts])
  );

  const handleClearHistory = async () => {
    try {
      await clearHistory();
    } catch (err) {
      alert("Erro ao limpar histórico na API.");
    }
  };

  const handleDeleteReport = async (id: number | string) => {
    try {
      await removeReport(id);
      setSelectedReport(null);
      alert("Denúncia removida com sucesso!");
    } catch (err) {
      alert("Erro ao remover denúncia.");
    }
  };

  async function prepareImageAttachment(imageUri: string, filename: string) {
    try {
      const docDir = FileSystem.documentDirectory || "";
      const path = `${docDir}${filename}`;

      if (imageUri.startsWith("http://") || imageUri.startsWith("https://")) {
        const result = await FileSystem.downloadAsync(imageUri, path);
        return result.uri;
      } else {
        let cleanBase64 = imageUri;
        if (imageUri.includes(";base64,")) {
          cleanBase64 = imageUri.split(";base64,")[1];
        }
        await FileSystem.writeAsStringAsync(path, cleanBase64, { encoding: FileSystem.EncodingType.Base64 });
        return path.startsWith("file://") ? path : `file://${path}`;
      }
    } catch (err) {
      console.warn("Erro ao preparar anexo de imagem:", err);
      return null;
    }
  }

  const sendEmailTo = async (recipientEmail: string) => {
    if (!selectedReport) return;
    setSendingEmail(true);
    try {
      const available = await MailComposer.isAvailableAsync();
      if (!available) {
        alert("Envio de e-mail não disponível neste dispositivo.");
        setSendingEmail(false);
        return;
      }

      const problemsStr = Array.isArray(selectedReport.problems)
        ? selectedReport.problems.join(", ")
        : selectedReport.problems || "Denúncia";

      const subject = `Denúncia de Problema: ${problemsStr}`;

      const bodyParts: string[] = [];
      bodyParts.push(`Problema(s): ${problemsStr}`);
      bodyParts.push(`Endereço: ${selectedReport.address}`);
      if (selectedReport.observation) {
        bodyParts.push(`Observação: ${selectedReport.observation}`);
      }
      const body = bodyParts.join("\n\n");

      const attachments: string[] = [];
      if (selectedReport.image) {
        const filename = `report-${selectedReport.id || Date.now()}.jpg`;
        const path = await prepareImageAttachment(selectedReport.image, filename);
        if (path) {
          attachments.push(path);
        }
      }

      await MailComposer.composeAsync({
        subject,
        body,
        recipients: [recipientEmail],
        attachments: attachments.length ? attachments : undefined,
      });

      setShowContactPicker(false);
      setSelectedReport(null);
    } catch (err) {
      console.warn("Erro ao enviar e-mail:", err);
      alert("Não foi possível abrir o composer de e-mail.");
    } finally {
      setSendingEmail(false);
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
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedReport(item)}
                  className="bg-white rounded-2xl border border-zinc-200/50 mb-4 overflow-hidden flex-row mx-6"
                >
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

                    <Text className="text-sm font-bold text-zinc-900 mb-1.5" numberOfLines={1}>
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
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* MODAL DE DETALHES DA DENÚNCIA */}
      {selectedReport && (
        <Modal
          visible={!!selectedReport}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedReport(null)}
        >
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white rounded-t-[32px] p-6 pb-10 max-h-[90%]">
              {/* HEADER DO MODAL */}
              <View className="flex-row justify-between items-center mb-4">
                <Heading size="lg" className="text-zinc-900 font-bold">Detalhes da Denúncia</Heading>
                <TouchableOpacity onPress={() => setSelectedReport(null)} className="p-1">
                  <Icon as={X} size="md" className="text-zinc-500" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedReport.image ? (
                  <Image
                    source={{ uri: selectedReport.image }}
                    className="w-full h-48 rounded-2xl bg-zinc-200 mb-4"
                    resizeMode="cover"
                  />
                ) : null}

                <View className="mb-4">
                  <Text className="text-xs font-bold text-zinc-500 uppercase">Problema(s)</Text>
                  <Text className="text-base font-bold text-zinc-900 mt-1">
                    {Array.isArray(selectedReport.problems)
                      ? selectedReport.problems.join(", ")
                      : selectedReport.problems || "Problema Geral"}
                  </Text>
                </View>

                <View className="mb-4">
                  <Text className="text-xs font-bold text-zinc-500 uppercase">Endereço</Text>
                  <View className="flex-row items-center mt-1">
                    <Icon as={MapPin} size="xs" className="text-red-600 mr-1.5" />
                    <Text className="text-sm font-semibold text-zinc-700 flex-1">{selectedReport.address}</Text>
                  </View>
                </View>

                {selectedReport.observation ? (
                  <View className="mb-6">
                    <Text className="text-xs font-bold text-zinc-500 uppercase">Observações</Text>
                    <Text className="text-sm italic text-zinc-600 mt-1">{selectedReport.observation}</Text>
                  </View>
                ) : null}

                {/* BOTÕES DE AÇÃO */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setShowContactPicker(true)}
                    activeOpacity={0.8}
                    className="flex-1 flex-row items-center justify-center bg-zinc-900 p-4 rounded-xl"
                  >
                    <Icon as={Mail} size="sm" className="text-white mr-2" />
                    <Text className="text-white font-bold text-sm">Enviar por E-mail</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteReport(selectedReport.id)}
                    activeOpacity={0.8}
                    className="flex-row items-center justify-center bg-red-50 border border-red-200 px-4 rounded-xl"
                  >
                    <Icon as={Trash2} size="sm" className="text-red-600" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* SELECIONADOR DE CONTATOS */}
      <Modal
        visible={showContactPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowContactPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white w-full max-h-[80%] rounded-[24px] p-6 shadow-xl border border-zinc-100">
            <View className="flex-row justify-between items-center mb-4">
              <Heading size="md" className="text-zinc-900 font-bold">Selecione o Destinatário</Heading>
              <TouchableOpacity onPress={() => setShowContactPicker(false)} className="p-1">
                <Icon as={X} size="md" className="text-zinc-500" />
              </TouchableOpacity>
            </View>

            {sendingEmail ? (
              <View className="py-8 justify-center items-center">
                <ActivityIndicator size="large" color="#1C1C1E" />
                <Text className="mt-3 font-semibold text-zinc-600">Preparando e-mail...</Text>
              </View>
            ) : contacts.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-zinc-500 text-sm font-semibold text-center mb-4">Você precisa cadastrar contatos primeiro.</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowContactPicker(false);
                    setSelectedReport(null);
                    navigation.navigate("Contacts");
                  }}
                  className="bg-zinc-900 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-bold text-sm">Ir para Contatos</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={contacts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => sendEmailTo(item.email)}
                    activeOpacity={0.7}
                    className="p-4 border-b border-zinc-100 flex-row items-center justify-between"
                  >
                    <View>
                      <Text className="text-sm font-bold text-zinc-900">{item.name}</Text>
                      <Text className="text-xs text-zinc-500 font-medium mt-0.5">{item.email}</Text>
                    </View>
                    <Icon as={Mail} size="sm" className="text-zinc-400" />
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
