import React, { useState, useCallback } from "react";
import { ScrollView, View, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

import { useContacts } from "@/hooks/useContacts";

import EditContactModal from "@/components/custom/EditContactModal";
import CreateContactModal from "@/components/custom/CreateContactModal";
import FloatingMenu from "@/components/custom/FloatingMenu";

export default function ContactsScreen() {
  const { contacts, loading, error, addContact, updateContact, deleteContact, fetchContacts } = useContacts();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [fetchContacts])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContacts().then(() => setRefreshing(false));
  }, [fetchContacts]);

  return (
    <View
      className="flex-1 bg-[#F9F9F6] p-6"
      style={{ paddingTop: 12 + insets.top, paddingBottom: insets.bottom }}
    >
      {/* BOTÃO VOLTAR */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home")}
        className="mb-8 py-2 self-start"
      >
        <Text className="text-zinc-900 font-medium text-base">← Voltar</Text>
      </TouchableOpacity>

      {/* TÍTULO */}
      <Heading className="text-zinc-900 mb-6 font-bold" size="2xl">
        Meus Contatos
      </Heading>

      {loading && !refreshing && <Text className="mt-4">Carregando contatos...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {contacts.map((contact) => (
          <TouchableOpacity key={contact.id} onPress={() => setSelectedContact(contact)}>
            <Card className="w-full mb-4 p-4 flex-row items-center bg-white border border-[#E5E5DE] rounded-[24px] shadow-sm">
              <View style={{ flex: 1 }}>
                <Heading size="md" className="text-zinc-900 font-bold mb-1">{contact.name}</Heading>
                <Text size="sm" className="text-zinc-600 font-medium">{contact.email}</Text>
              </View>
              <Text className="text-[#9A9A9A] font-bold text-sm mr-1">
                →
              </Text>
            </Card>
          </TouchableOpacity>
        ))}

        {!loading && contacts.length === 0 && (
          <Text className="text-center mt-8 text-zinc-500 font-medium">Nenhum contato encontrado.</Text>
        )}
      </ScrollView>

      <FloatingMenu
        onOpenContactModal={() => setShowContactModal(true)}
      />

      <CreateContactModal
        showModal={showContactModal}
        setShowModal={setShowContactModal}
        addContact={addContact}
      />
      <EditContactModal
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
        updateContact={updateContact}
        deleteContact={deleteContact}
      />
    </View>
  );
}
