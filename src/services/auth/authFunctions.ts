import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/constants/api";

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Erro ao registrar usuário");
  }

  return await res.json();
}

export async function signInFunction(email: string, password: string): Promise<string> {
  if (!email || !password) throw new Error("Preencha todos os campos");

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Credenciais inválidas");

  const data = await res.json();
  return data.access_token;
}

export async function signOutFunction(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem("session");
  } else {
    await SecureStore.deleteItemAsync("session");
  }
}
