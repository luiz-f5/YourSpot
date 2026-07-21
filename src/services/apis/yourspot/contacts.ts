import { getSession } from "@/services/auth/session";
import nestApi from "@/services/apis/nest/nest";

export interface ContactPayload {
  name: string;
  email: string;
}

export async function getContacts() {
  const token = (await getSession()) || "";
  const res = await nestApi.get("/contacts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createContact(payload: ContactPayload) {
  const token = (await getSession()) || "";
  try {
    const res = await nestApi.post("/contacts", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    const text = err.response?.data || err.message;
    throw new Error(`Erro ao criar contato: ${text}`);
  }
}