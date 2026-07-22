import React from "react";
import { Modal, View, TextInput, TouchableOpacity } from "react-native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function EditContactModal({
  selectedContact,
  setSelectedContact,
  updateContact,
  deleteContact,
}: {
  selectedContact: any;
  setSelectedContact: (contact: any) => void;
  updateContact: (contact: any) => Promise<any>;
  deleteContact: (id: number) => Promise<void>;
}) {
  if (!selectedContact) return null;

  return (
    <Modal
      visible={!!selectedContact}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setSelectedContact(null)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={() => setSelectedContact(null)}
        className="flex-1, bg-[#F9F9F9] justify-center items-center"
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}
      >
        <View style={{ width: "90%", borderRadius: 12, padding: 20 }} className="bg-card">
          <Heading size="lg" className="mb-4 text-foreground">Editar Contato</Heading>
          
          <TextInput
            placeholder="Nome"
            value={selectedContact?.name ?? ""}
            onChangeText={(t) => setSelectedContact((prev: any) => (prev ? { ...prev, name: t } : prev))}
            className="border border-input p-2 text-foreground mb-3"
          />
          <TextInput
            placeholder="E-mail"
            value={selectedContact?.email ?? ""}
            onChangeText={(d) => setSelectedContact((prev: any) => (prev ? { ...prev, email: d } : prev))}
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-input p-2 text-foreground mb-3"
          />

          <TouchableOpacity
            onPress={async () => {
              await updateContact(selectedContact);
              setSelectedContact(null);
            }}
            className="bg-primary p-3 rounded-lg mb-3"
          >
            <Text className="text-primary-foreground text-center">Salvar Contato</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              await deleteContact(selectedContact.id);
              setSelectedContact(null);
            }}
            className="bg-destructive p-3 rounded-lg"
          >
            <Text className="text-primary-foreground text-center">Deletar Contato</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}