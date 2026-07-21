import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity, RefreshControl } from "react-native";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Container from "@/components/custom/Container";

import { useSpots } from "@/hooks/useSpots";
import { useContacts } from "@/hooks/useContacts";

import ImageLoader from "@/components/custom/ImageLoader";
import CreateSpotModal from "@/components/custom/CreateSpotModal";
import EditSpotModal from "@/components/custom/EditSpotModal";
import CreateContactModal from "@/components/custom/CreateContactModal";
// Importe o novo botão
import FloatingMenu from "@/components/custom/FloatingMenu";

export default function App() {
  const { spots, loading, error, addSpot, updateSpot, deleteSpot, fetchSpots } = useSpots();
  const { addContact } = useContacts();
  
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchSpots().then(() => setRefreshing(false));
  }, [fetchSpots]);

  return (
    <Container>
      {loading && !refreshing && <Text>Carregando spots...</Text>}
      {error && <Text>{error}</Text>}
  
      <ScrollView
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
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

        {!loading && spots.length === 0 && (
          <Text className="text-center mt-4 text-foreground">Nenhum spot encontrado.</Text>
        )}
      </ScrollView>
      <FloatingMenu 
        onOpenSpotModal={() => setShowSpotModal(true)} 
        onOpenContactModal={() => setShowContactModal(true)} 
      />
  
      <CreateSpotModal showModal={showSpotModal} setShowModal={setShowSpotModal} addSpot={addSpot} />
      <CreateContactModal showModal={showContactModal} setShowModal={setShowContactModal} addContact={addContact} />
      <EditSpotModal selectedSpot={selectedSpot} setSelectedSpot={setSelectedSpot} updateSpot={updateSpot} deleteSpot={deleteSpot} />
    </Container>
  );
}