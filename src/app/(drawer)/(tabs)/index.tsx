import React, { useState, useEffect } from "react";
import { Image, ScrollView, View, Modal, TextInput, TouchableOpacity } from "react-native";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Container from "@/components/custom/Container";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useSpots } from "@/hooks/useSpots";
import { SpotPayload } from "@/services/apis/yourspot/spots";
import { getSession } from "@/services/auth/session";
import { Buffer } from "buffer";
import { API_URL } from "@/constants/api";

async function getImageUrl(spotId: number): Promise<string> {
  const token = (await getSession()) || "";
  const res = await fetch(`${API_URL}/spots/${spotId}/image`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar imagem");
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

function ImageLoader({ spotId }: { spotId: number }) {
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    getImageUrl(spotId).then(setUri).catch(console.error);
  }, [spotId]);
  if (!uri) return null;
  return <Image source={{ uri }} style={{ width: 80, height: 80, marginRight: 12, borderRadius: 8 }} />;
}

export default function App() {
  const { spots, loading, error, addSpot, updateSpot, deleteSpot } = useSpots();
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null); 

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
    <Container>
      {loading && <Text>Carregando spots...</Text>}
      {error && <Text>{error}</Text>}
  
      <ScrollView>
        {spots.map((spot) => (
          <TouchableOpacity key={spot.id} onPress={() => setSelectedSpot(spot)}>
            <Card className="w-100 mb-4 p-4 flex-row items-center bg-card">
              {spot.imagePath && <ImageLoader spotId={spot.id} />}
              <View style={{ flex: 1 }}>
                <Heading size="md">{spot.title}</Heading>
                <Text size="sm">{spot.description}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
  
      {/* Botão flutuante */}
      <View style={{ position: "absolute", bottom: 30, right: 30 }}>
        {showOptions && (
          <View style={{ marginBottom: 10 }}>
            <TouchableOpacity
              className="bg-secondary p-2 rounded-full mb-2"
              onPress={() => setShowModal(true)}
            >
              <Text className="text-foreground">Criar Spot</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: "#f5c518",
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setShowOptions(!showOptions)}
        >
          <Text style={{ fontSize: 30, color: "#fff" }}>+</Text>
        </TouchableOpacity>
      </View>
  
      {/* Modal de criação */}
      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View className="flex-1 p-5 bg-background">
          <Heading size="lg" className="mb-4">Novo Spot</Heading>
          <TextInput
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
          />
          <TouchableOpacity onPress={pickImage}><Text>Selecionar Imagem</Text></TouchableOpacity>
          {imageBase64 && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
              style={{ width: 100, height: 100 }}
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
  
      {/* Modal de edição */}
      <Modal
        visible={!!selectedSpot}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedSpot(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setSelectedSpot(null)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ width: "90%", borderRadius: 12, padding: 20 }}
            className="bg-card"
          >
            <Heading size="lg" className="mb-4 text-foreground">Editar Spot</Heading>
            <TextInput
              placeholder="Título"
              value={selectedSpot?.title}
              onChangeText={(t) => setSelectedSpot({ ...selectedSpot, title: t })}
              className="border border-input p-2 text-foreground mb-3"
            />
            <TextInput
              placeholder="Descrição"
              value={selectedSpot?.description}
              onChangeText={(d) => setSelectedSpot({ ...selectedSpot, description: d })}
              className="border border-input p-2 text-foreground mb-3"
            />

            <TouchableOpacity
              onPress={async () => {
                await updateSpot(selectedSpot);
                setSelectedSpot(null);
              }}
              className="bg-primary p-3 rounded-lg mb-3"
            >
              <Text className="text-primary-foreground text-center">Salvar Spot</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await deleteSpot(selectedSpot.id);
                setSelectedSpot(null);
              }}
              className="bg-destructive p-3 rounded-lg"
            >
              <Text className="text-primary-foreground text-center">Deletar Spot</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Container>
  );
}