import { getSession } from "@/services/auth/session";
import nestApi from "@/services/apis/nest/nest";

export interface ReportPayload {
  problems: string[];
  address: string;
  observation?: string;
  image: string;
}

export async function getReports() {
  const token = (await getSession()) || "";
  const res = await nestApi.get("/reports", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createReport(payload: ReportPayload) {
  const token = (await getSession()) || "";
  try {
    const res = await nestApi.post("/reports", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    const text = err.response?.data?.message || err.response?.data || err.message;
    throw new Error(`Erro ao criar denúncia: ${text}`);
  }
}

export async function deleteReport(id: string | number) {
  const token = (await getSession()) || "";
  try {
    const res = await nestApi.delete(`/reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    const text = err.response?.data?.message || err.response?.data || err.message;
    throw new Error(`Erro ao deletar denúncia: ${text}`);
  }
}

export async function clearAllReports() {
  const token = (await getSession()) || "";
  try {
    const res = await nestApi.delete("/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    const text = err.response?.data?.message || err.response?.data || err.message;
    throw new Error(`Erro ao limpar denúncias: ${text}`);
  }
}
