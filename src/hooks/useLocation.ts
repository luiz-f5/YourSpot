import { useState, useEffect } from "react";
import { Platform } from "react-native";

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

let Location: any = null;
if (Platform.OS !== "web") {
  Location = require("expo-location");
}

export function useLocation() {
  const [region, setRegion] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Platform.OS === "web") {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            });
            setLoading(false);
          },
          () => {
            setErrorMsg("Permissão de localização negada.");
            setRegion({
              latitude: -15.7801,
              longitude: -47.9292,
              latitudeDelta: 0.09,
              longitudeDelta: 0.09,
            });
            setLoading(false);
          }
        );
      } else {
        setErrorMsg("Geolocalização não suportada no navegador.");
        setRegion({
          latitude: -15.7801,
          longitude: -47.9292,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        });
        setLoading(false);
      }
      return;
    }

    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("A permissão de acesso ao GPS foi negada.");
          setRegion({
            latitude: -15.7801,
            longitude: -47.9292,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
          });
          setLoading(false);
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
      } catch (err) {
        setErrorMsg("Erro ao buscar GPS nativo.");
        setRegion({
          latitude: -15.7801,
          longitude: -47.9292,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        });
      } finally {
        setLoading(false);
      }
    }
    getCurrentLocation();
  }, []);

  return { region, setRegion, errorMsg, loading };
}
