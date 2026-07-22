import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Check, ArrowLeft, RefreshCw, Send, MapPin } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReportScreen() {
  const navigation = useNavigation<any>();

  const problemsList = [
    "Buraco na via",
    "Lixo / Entulho acumulado",
    "Iluminação pública queimada",
    "Vazamento de água / esgoto",
    "Mato alto / Terreno abandonado",
    "Sinalização danificada",
    "Árvore com risco de queda"
  ];

  const [allowMultiple, setAllowMultiple] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [observation, setObservation] = useState("");

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("Buscando endereço...");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function getAddressFromGPS() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setAddress("Localização não autorizada");
          setLoadingLocation(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        if (reverseGeocode.length > 0) {
          const item = reverseGeocode[0];
          const formattedAddress = `${item.street || "Rua não identificada"}, ${item.streetNumber || "S/N"} - ${item.subregion || item.city || "Cidade"}`;
          setAddress(formattedAddress);
        } else {
          setAddress("Endereço não encontrado");
        }
      } catch (error) {
        setAddress("Erro ao obter endereço do GPS");
      } finally {
        setLoadingLocation(false);
      }
    }

    getAddressFromGPS();
  }, []);

  const toggleAllowMultiple = () => {
    setAllowMultiple(!allowMultiple);
    setSelectedProblems([]);
  };

  const handleSelectProblem = (problem: string) => {
    if (allowMultiple) {
      if (selectedProblems.includes(problem)) {
        setSelectedProblems(selectedProblems.filter((p) => p !== problem));
      } else {
        setSelectedProblems([...selectedProblems, problem]);
      }
    } else {
      setSelectedProblems([problem]);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permissão para usar a câmera é necessária!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleSaveReport = async () => {
    if (selectedProblems.length === 0 || !capturedImage) return;

    setIsSubmitting(true);
    try {
      const newReport = {
        id: Date.now().toString(),
        problems: selectedProblems,
        address,
        observation,
        image: capturedImage,
        date: new Date().toLocaleDateString("pt-BR")
      };

      const existingData = await AsyncStorage.getItem("@user_reports");
      const reports = existingData ? JSON.parse(existingData) : [];
      reports.unshift(newReport);

      await AsyncStorage.setItem("@user_reports", JSON.stringify(reports));

      alert("Denúncia registrada com sucesso!");
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Home");
      }
    } catch (error) {
      alert("Erro ao salvar denúncia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F9F9F6] pt-12">
      {/* CABEÇALHO */}
      <View className="px-6 mb-4">
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home")} className="flex-row items-center mb-3 self-start">
          <Icon as={ArrowLeft} size="md" className="text-zinc-900" />
          <Text className="text-zinc-900 font-semibold ml-1.5">Voltar</Text>
        </TouchableOpacity>
        <Heading size="xl" className="text-zinc-900 font-bold">Reportar Problema</Heading>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>

        {/* CARD DE ENDEREÇO */}
        <View className="mx-6 p-3.5 bg-white rounded-2xl border border-zinc-200/50 flex-row items-center mb-4">
          <Icon as={MapPin} size="sm" className="text-red-600 mr-2" />
          <View className="flex-1">
            <Text className="text-[11px] font-bold text-zinc-500 uppercase">Local da Ocorrência</Text>
            {loadingLocation ? (
              <ActivityIndicator size="small" color="#1C1C1E" className="self-start mt-1" />
            ) : (
              <Text className="text-[13px] font-semibold text-zinc-900 mt-0.5">{address}</Text>
            )}
          </View>
        </View>

        {/* SE JÁ TIVER FOTO: MOSTRA A PRÉ-VISUALIZAÇÃO */}
        {capturedImage ? (
          <View className="px-6">
            <Text className="text-[13px] font-bold text-zinc-900 mb-2">Foto Capturada</Text>
            <Image source={{ uri: capturedImage }} className="w-full h-[260px] rounded-2xl bg-zinc-200" style={{ resizeMode: "cover" }} />

            <View className="flex-row justify-end mt-2">
              <TouchableOpacity activeOpacity={0.8} onPress={handleTakePhoto} className="flex-row items-center py-2 px-3 bg-zinc-200 rounded-lg">
                <Icon as={RefreshCw} size="sm" className="text-zinc-900 mr-1.5" />
                <Text className="text-xs font-semibold text-zinc-900">Tirar Outra</Text>
              </TouchableOpacity>
            </View>

            {/* CAMPO DE OBSERVAÇÃO OPCIONAL */}
            <Text className="text-[13px] font-bold text-zinc-900 mb-2 mt-4">Observações (Opcional)</Text>
            <TextInput
              className="bg-white border border-zinc-200/50 rounded-xl p-3 h-20 text-sm text-zinc-900"
              style={{ textAlignVertical: "top" }}
              placeholder="Ex: Próximo à padaria, poste piscando..."
              placeholderTextColor="#999"
              multiline
              value={observation}
              onChangeText={setObservation}
            />
          </View>
        ) : (
          <>
            {/* CARD DA PERGUNTA */}
            <View className="mx-6 p-4 bg-white rounded-2xl border border-zinc-200/50 flex-row justify-between items-center mb-4">
              <Text className="text-sm font-bold text-zinc-900">Qual é o problema?</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={toggleAllowMultiple} className="flex-row items-center bg-[#F4F4F0] px-2.5 py-1.5 rounded-lg">
                <View className={`w-[18px] h-[18px] rounded border border-zinc-900 justify-center items-center mr-1.5 ${allowMultiple ? 'bg-zinc-900' : ''}`}>
                  {allowMultiple && <Icon as={Check} size="xs" className="text-white" />}
                </View>
                <Text className="text-[12px] font-semibold text-zinc-900">Mais de um?</Text>
              </TouchableOpacity>
            </View>

            {/* LISTA DE OPÇÕES */}
            <View className="px-6 flex-row flex-wrap gap-2">
              {problemsList.map((problem) => {
                const isSelected = selectedProblems.includes(problem);
                return (
                  <TouchableOpacity
                    key={problem}
                    activeOpacity={0.85}
                    onPress={() => handleSelectProblem(problem)}
                    className={`py-3 px-4 rounded-3xl bg-white border border-zinc-200/50 mb-1 ${isSelected ? 'bg-zinc-900 border-zinc-900' : ''}`}
                  >
                    <Text className={`text-[13px] font-semibold text-zinc-900 ${isSelected ? 'text-white' : ''}`}>
                      {problem}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* RODAPÉ FIXO */}
      <View className="absolute bottom-0 left-0 right-0 pb-8 pt-4 px-6 bg-[#F9F9F6]/95 items-center border-t border-zinc-200/50">
        {!capturedImage ? (
          <>
            <Text className="text-xs text-zinc-500 mb-3 font-medium">
              {selectedProblems.length === 0 ? "Selecione ao menos um problema para tirar a foto" : `${selectedProblems.length} problema(s) selecionado(s)`}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={selectedProblems.length === 0}
              onPress={handleTakePhoto}
              className={`w-[72px] h-[72px] rounded-full border-4 border-zinc-900 justify-center items-center bg-white ${selectedProblems.length === 0 ? 'opacity-40' : ''}`}
            >
              <View className="w-[54px] h-[54px] rounded-full bg-red-600" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isSubmitting}
            onPress={handleSaveReport}
            className="w-full bg-zinc-900 py-3.5 rounded-2xl flex-row justify-center items-center active:bg-zinc-800"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon as={Send} size="sm" className="text-white mr-2" />
                <Text className="text-white text-sm font-bold">Enviar Denúncia</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
