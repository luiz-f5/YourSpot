import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";

interface FloatingMenuProps {
  onOpenSpotModal: () => void;
  onOpenContactModal: () => void;
}

export default function FloatingMenu({ onOpenSpotModal, onOpenContactModal }: FloatingMenuProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={{ position: "absolute", bottom: 30, right: 30 }}>
      {showOptions && (
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            className="bg-secondary p-2 rounded-full mb-2"
            onPress={() => {
              setShowOptions(false);
              onOpenSpotModal();
            }}
          >
            <Text className="text-foreground text-center">Criar Spot</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-secondary p-2 rounded-full mb-2"
            onPress={() => {
              setShowOptions(false);
              onOpenContactModal();
            }}
          >
            <Text className="text-foreground text-center">Criar Contato</Text>
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
  );
}