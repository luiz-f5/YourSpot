import React from "react";
import { Modal, View, TextInput, TouchableOpacity } from "react-native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function EditSpotModal({
  selectedSpot,
  setSelectedSpot,
  updateSpot,
  deleteSpot,
}: {
  selectedSpot: any;
  setSelectedSpot: (spot: any) => void;
  updateSpot: (spot: any) => Promise<void>;
  deleteSpot: (id: number) => Promise<void>;
}) {
  if (!selectedSpot) return null;

  return (
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
        <View style={{ width: "90%", borderRadius: 12, padding: 20 }} className="bg-card">
          <Heading size="lg" className="mb-4 text-foreground">Editar Spot</Heading>
          
          <TextInput
            placeholder="Título"
            value={selectedSpot?.title ?? ""}
            onChangeText={(t) => setSelectedSpot((prev: any) => (prev ? { ...prev, title: t } : prev))}
            className="border border-input p-2 text-foreground mb-3"
          />
          <TextInput
            placeholder="Descrição"
            value={selectedSpot?.description ?? ""}
            onChangeText={(d) => setSelectedSpot((prev: any) => (prev ? { ...prev, description: d } : prev))}
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
  );
}