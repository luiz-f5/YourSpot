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

// Global memory cache to prevent flickering on remount
let cachedRegion: Region | null = null;

export function useLocation() {
  const [region, setRegion] = useState<Region | null>(cachedRegion);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!cachedRegion);

  useEffect(() => {
    if (Platform.OS === "web") {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const nextRegion = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            };
            cachedRegion = nextRegion;
            setRegion(nextRegion);
            setLoading(false);
          },
          () => {
            setErrorMsg("Permissão de localização negada.");
            const defaultRegion = {
              latitude: -15.7801,
              longitude: -47.9292,
              latitudeDelta: 0.09,
              longitudeDelta: 0.09,
            };
            cachedRegion = defaultRegion;
            setRegion(defaultRegion);
            setLoading(false);
          }
        );
      } else {
        setErrorMsg("Geolocalização não suportada no navegador.");
        const defaultRegion = {
          latitude: -15.7801,
          longitude: -47.9292,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        };
        cachedRegion = defaultRegion;
        setRegion(defaultRegion);
        setLoading(false);
      }
      return;
    }

    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("A permissão de acesso ao GPS foi negada.");
          const defaultRegion = {
            latitude: -15.7801,
            longitude: -47.9292,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
          };
          cachedRegion = defaultRegion;
          setRegion(defaultRegion);
          setLoading(false);
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const nextRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        };
        cachedRegion = nextRegion;
        setRegion(nextRegion);
      } catch (err) {
        setErrorMsg("Erro ao buscar GPS nativo.");
        const defaultRegion = {
          latitude: -15.7801,
          longitude: -47.9292,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        };
        cachedRegion = defaultRegion;
        setRegion(defaultRegion);
      } finally {
        setLoading(false);
      }
    }
    getCurrentLocation();
  }, []);

  return { region, setRegion, errorMsg, loading };
}
