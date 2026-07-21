import React, { useState } from "react";
import { Modal, View, TextInput, TouchableOpacity } from "react-native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ContactPayload } from "@/services/apis/yourspot/contacts";

export default function CreateContactModal({
  showModal,
  setShowModal,
  addContact,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  addContact: (payload: ContactPayload) => Promise<any>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function saveContact() {
    if (!name || !email) {
      alert("Por favor, preencha nome e e-mail.");
      return;
    }
    
    const payload: ContactPayload = { name, email };
    await addContact(payload);
    
    setShowModal(false);
    setName("");
    setEmail("");
  }

  return (
    <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
      <View className="flex-1 p-5 bg-background">
        <Heading size="lg" className="mb-4">Novo Contato</Heading>
        
        <TextInput
          placeholder="Nome"
          value={name ?? ""}
          onChangeText={setName}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
        />
        <TextInput
          placeholder="E-mail"
          value={email ?? ""}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 }}
        />
        
        <TouchableOpacity
          onPress={saveContact}
          style={{ marginTop: 20, backgroundColor: "#f5c518", padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Salvar Contato</Text>
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