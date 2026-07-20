import { useContext } from "react";
import AuthContext from "./ctxAuth";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}

export async function getSession(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem("session");
  } else {
    return await SecureStore.getItemAsync("session");
  }
}