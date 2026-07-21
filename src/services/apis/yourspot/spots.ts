import { getSession } from "@/services/auth/session";
import nestApi from "@/services/apis/nest/nest";

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
  const res = await nestApi.get("/spots", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createSpot(payload: SpotPayload) {
  const token = (await getSession()) || "";
  try {
    const res = await nestApi.post("/spots", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    const text = err.response?.data || err.message;
    throw new Error(`Erro ao criar spot: ${text}`);
  }
}