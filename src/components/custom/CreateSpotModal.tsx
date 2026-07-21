import React, { useState } from "react";
import { Modal, View, TextInput, TouchableOpacity, Image } from "react-native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { SpotPayload } from "@/services/apis/yourspot/spots";

export default function CreateSpotModal({
  showModal,
  setShowModal,
  addSpot,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  addSpot: (payload: SpotPayload) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setImageBase64(result.assets[0].base64 ?? null);
    }
  }

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão de localização negada");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);
  }

  async function saveSpot() {
    const payload: SpotPayload = {
      title: title || "",
      description: description || "",
      imageBase64: imageBase64 ?? undefined,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      location: "Local atual",
    };
    await addSpot(payload);
    
    setShowModal(false);
    setTitle("");
    setDescription("");
    setImageBase64(null);
    setLatitude(null);
    setLongitude(null);
  }

  return (
    <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
      <View className="flex-1 p-5 bg-background">
        <Heading size="lg" className="mb-4">Novo Spot</Heading>

        <TextInput
          placeholder="Título"
          value={title ?? ""}
          onChangeText={setTitle}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Descrição"
          value={description ?? ""}
          onChangeText={setDescription}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
        />
        
        <TouchableOpacity onPress={pickImage}><Text>Selecionar Imagem</Text></TouchableOpacity>
        {imageBase64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={{ width: 100, height: 100, marginVertical: 10 }}
          />
        )}
        
        <TouchableOpacity onPress={getLocation}><Text>Obter Localização</Text></TouchableOpacity>
        
        <TouchableOpacity
          onPress={saveSpot}
          style={{ marginTop: 20, backgroundColor: "#f5c518", padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Salvar Spot</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowModal(false)}
          style={{ marginTop: 10, backgroundColor: "#ccc", padding: 12, borderRadius: 8 }}
        >
          <Text style={{ textAlign: "center" }}>Sair</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}