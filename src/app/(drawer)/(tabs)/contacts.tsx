import React, { useState, useCallback } from "react";
import { ScrollView, View, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Container from "@/components/custom/Container";

import { useContacts } from "@/hooks/useContacts";
import { useSpots } from "@/hooks/useSpots"; 

import EditContactModal from "@/components/custom/EditContactModal";
import CreateContactModal from "@/components/custom/CreateContactModal";
import CreateSpotModal from "@/components/custom/CreateSpotModal";
import FloatingMenu from "@/components/custom/FloatingMenu";

export default function ContactsScreen() {
  const { contacts, loading, error, addContact, updateContact, deleteContact, fetchContacts } = useContacts();
  const { addSpot } = useSpots();
  
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSpotModal, setShowSpotModal] = useState(false);
  
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
    <Container>
      {loading && !refreshing && <Text className="mt-4 ml-4">Carregando contatos...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      
      <ScrollView
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {contacts.map((contact) => (
          <TouchableOpacity key={contact.id} onPress={() => setSelectedContact(contact)}>
            <Card className="w-100 mb-4 p-4 flex-row items-center bg-card">
              <View style={{ flex: 1 }}>
                <Heading size="md">{contact.name}</Heading>
                <Text size="sm">{contact.email}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {!loading && contacts.length === 0 && (
          <Text className="text-center mt-4 text-foreground">Nenhum contato encontrado.</Text>
        )}
      </ScrollView>

      <FloatingMenu 
        onOpenSpotModal={() => setShowSpotModal(true)} 
        onOpenContactModal={() => setShowContactModal(true)} 
      />

      <CreateSpotModal 
        showModal={showSpotModal} 
        setShowModal={setShowSpotModal} 
        addSpot={addSpot} 
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
    </Container>
  );
}