import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FloatingMenuProps {
  onOpenContactModal: () => void;
}

export default function FloatingMenu({ onOpenContactModal }: FloatingMenuProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ position: "absolute", bottom: 20 + insets.bottom, right: 30 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#f5c518",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onOpenContactModal}
      >
        <Text style={{ fontSize: 30, color: "#fff" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
