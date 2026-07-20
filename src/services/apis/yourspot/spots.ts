import { getSession } from "@/services/auth/session";
import { API_URL } from "@/constants/api";

export interface SpotPayload {
  title: string;
  description: string;
  imageBase64?: string;
  latitude: number;
  longitude: number;
  location: string;
}

export async function getSpots() {
  const token = (await getSession()) || "";
  const res = await fetch(`${API_URL}/spots`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar spots");
  return res.json();
}

export async function createSpot(payload: SpotPayload) {
  const token = (await getSession()) || "";
  const res = await fetch(`${API_URL}/spots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao criar spot: ${text}`);
  }

  return res.json();
}
