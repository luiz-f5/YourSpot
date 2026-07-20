import { useEffect, useState } from "react";
import { getSpots, createSpot, SpotPayload } from "@/services/apis/yourspot/spots";
import { API_URL } from "@/constants/api";
import { getSession } from "@/services/auth/session";

export function useSpots() {
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpots() {
      try {
        setLoading(true);
        const data = await getSpots();
        setSpots(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSpots();
  }, []);

  async function addSpot(payload: SpotPayload) {
    try {
      const newSpot = await createSpot(payload);
      setSpots((prev) => [...prev, newSpot]);
      return newSpot;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function updateSpot(updated: any) {
    try {
      const res = await fetch(`${API_URL}/spots/${updated.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await getSession()) || ""}`,
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Erro ao atualizar spot");
      const spot = await res.json();
      setSpots((prev) => prev.map((s) => (s.id === spot.id ? spot : s)));
      return spot;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function deleteSpot(id: number) {
    try {
      const res = await fetch(`${API_URL}/spots/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${(await getSession()) || ""}` },
      });
      if (!res.ok) throw new Error("Erro ao deletar spot");
      setSpots((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return { spots, loading, error, addSpot, updateSpot, deleteSpot };
}
